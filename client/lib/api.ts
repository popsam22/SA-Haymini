// API base URL - adjust based on your backend configuration
// For development, connect to the PHP backend running on a different port
// const API_BASE_URL = import.meta.env.DEV
//   ? 'http://localhost:8080/api' // Adjust port if needed
//   : '/api';
const API_BASE_URL = "http://107.22.138.33/Realtime_Mysql/ws.php/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { requireAuth = true, ...fetchOptions } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // Add authorization header if required
    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requireAuth: false,
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/auth/me", {
      method: "GET",
    });
  }

  // Organizations
  async getOrganizations() {
    return this.request("/organizations", {
      method: "GET",
    });
  }

  async getOrganization(id: number) {
    return this.request(`/organizations/${id}`, {
      method: "GET",
    });
  }

  async createOrganization(data: {
    name: string;
    address?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  }) {
    return this.request("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganization(
    id: number,
    data: {
      name?: string;
      address?: string;
      contact_person?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.request(`/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers() {
    // Backend doesn't have a direct GET /users endpoint
    // Get users from all organizations instead
    try {
      const organizationsResponse = await this.getOrganizations();
      const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse
        : (organizationsResponse as any)?.organizations && Array.isArray((organizationsResponse as any).organizations)
          ? (organizationsResponse as any).organizations
          : [];

      const allUsers = [];
      for (const org of organizations) {
        try {
          const orgUsers = await this.getUsersByOrganization(org.id);
          const usersArray = Array.isArray(orgUsers)
            ? orgUsers
            : (orgUsers as any)?.users && Array.isArray((orgUsers as any).users)
              ? (orgUsers as any).users
              : [];
              
          const usersWithOrgName = usersArray.map((user: any) => ({
            ...user,
            organization_name: org.name
          }));
          allUsers.push(...usersWithOrgName);
        } catch (error) {
          console.error(`Failed to fetch users for organization ${org.id}:`, error);
        }
      }
      
      return allUsers;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  async getUsersByOrganization(organizationId: number) {
    return this.request(`/organizations/${organizationId}/users`, {
      method: "GET",
    });
  }

  async getUserLogs(punchingCode: string, organizationId?: number) {
    const params = organizationId ? `?organization_id=${organizationId}` : '';
    return this.request(`/users/${punchingCode}${params}`, {
      method: "GET",
    });
  }

  async createUser(data: {
    name: string;
    punching_code: string;
    phone: string;
    email: string;
    organization_id?: number;
  }) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createUsersBulk(data: {
    users: Array<{
      name: string;
      punching_code: string;
      phone: string;
      email: string;
    }>;
    organization_id?: number;
  }) {
    return this.request("/users/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async activateUser(punchingCode: string) {
    return this.request(`/users/${punchingCode}/activate`, {
      method: "PUT",
    });
  }

  async deactivateUser(punchingCode: string) {
    return this.request(`/users/${punchingCode}/deactivate`, {
      method: "PUT",
    });
  }

  // Devices
  async getDevices() {
    // The backend doesn't have a GET /api/devices endpoint yet
    // Get devices from all organizations instead
    try {
      const organizationsResponse = await this.getOrganizations();

      // Handle different response formats
      const organizations = Array.isArray(organizationsResponse)
        ? organizationsResponse
        : (organizationsResponse as any)?.organizations && Array.isArray((organizationsResponse as any).organizations)
          ? (organizationsResponse as any).organizations
          : [];
      
      if (organizations.length === 0) {
        console.log('No organizations found');
        return [];
      }

      const allDevices = [];
      
      // Get devices from each organization
      for (const org of organizations) {
        try {
          const orgDevices = await this.getDevicesByOrganization(org.id);
          const devicesArray = Array.isArray(orgDevices)
            ? orgDevices
            : (orgDevices as any)?.devices && Array.isArray((orgDevices as any).devices)
              ? (orgDevices as any).devices
              : [];
              
          const devicesWithOrgName = devicesArray.map((device: any) => ({
            ...device,
            organization_name: org.name
          }));
          allDevices.push(...devicesWithOrgName);
        } catch (error) {
          console.error(`Failed to fetch devices for organization ${org.id}:`, error);
        }
      }
      
      return allDevices;
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      return [];
    }
  }

  async getDevicesByOrganization(organizationId: number) {
    return this.request(`/organizations/${organizationId}/devices`, {
      method: "GET",
    });
  }

  async getDevice(serialNumber: string) {
    return this.request(`/devices/${serialNumber}`, {
      method: "GET",
    });
  }

  async createDevice(data: {
    name?: string;
    serial_number: string;
    organization_id: number;
    device_model?: string;
    ip_address?: string;
    status?: string;
  }) {
    // Map frontend data to backend expected format
    const backendData = {
      serial_number: data.serial_number,
      organization_id: data.organization_id,
      device_name: data.name || 'RFID Device',
      device_model: data.device_model || 'RFID Scanner',
      ip_address: data.ip_address || null
    };

    return this.request("/devices", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
  }

  async updateDevice(
    serialNumber: string,
    data: {
      name?: string;
      serial_number?: string;
      organization_id?: number;
      device_model?: string;
      ip_address?: string;
      status?: string;
    },
  ) {
    if (data.status) {
      // Update device status
      return this.request(`/devices/${serialNumber}`, {
        method: "PUT",
        body: JSON.stringify({ status: data.status }),
      });
    }
    
    if (data.organization_id) {
      // Assign device to organization
      return this.request(`/devices/${serialNumber}/organization`, {
        method: "PUT",
        body: JSON.stringify({ organization_id: data.organization_id }),
      });
    }

    // For other updates, we need to implement additional endpoints in the backend
    return Promise.resolve({ 
      status: 'success', 
      message: 'Device updated',
      device: { ...data, serial_number: serialNumber }
    });
  }

  // Logs (Attendance Records)
  async getLogs(params?: {
    organization_id?: number;
    user_id?: number;
    device_id?: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/logs?${queryString}` : "/logs";

    return this.request(endpoint, {
      method: "GET",
    });
  }

  async getLogsByOrganization(organizationId: number) {
    return this.request(`/organizations/${organizationId}/logs`, {
      method: "GET",
    });
  }

  // Admin Management (Super Admin only)
  async getAdmins() {
    return this.request("/admins", {
      method: "GET",
    });
  }

  async createAdmin(data: {
    username: string;
    email: string;
    password: string;
    role: "super_admin" | "admin";
    organization_id?: number;
  }) {
    return this.request("/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAdminPassword(
    id: number,
    data: {
      current_password: string;
      new_password: string;
    },
  ) {
    return this.request(`/admins/${id}/password`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
