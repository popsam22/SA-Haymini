const API_BASE_URL = "https://api.haymini.net/Realtime_Mysql/ws.php/api";

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
      status?: "active" | "inactive";
    },
  ) {
    return this.request(`/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers() {
    // Use the new search endpoint
    return this.request("/users", {
      method: "GET",
    });
  }

  async searchUsers(params?: {
    search?: string;
    organization_id?: number;
    user_type?: "staff" | "student";
    status?: "active" | "inactive";
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.organization_id) queryParams.append("organization_id", params.organization_id.toString());
    if (params?.user_type) queryParams.append("user_type", params.user_type);
    if (params?.status) queryParams.append("status", params.status);

    const query = queryParams.toString();
    return this.request(`/users${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  }

  async getUsersByOrganization(organizationId: number) {
    return this.request(`/organizations/${organizationId}/users`, {
      method: "GET",
    });
  }

  async getUserLogs(punchingCode: string, organizationId?: number) {
    const params = organizationId ? `?organization_id=${organizationId}` : "";
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

  async updateUser(data: {
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
        : (organizationsResponse as any)?.organizations &&
            Array.isArray((organizationsResponse as any).organizations)
          ? (organizationsResponse as any).organizations
          : [];

      if (organizations.length === 0) {
        console.log("No organizations found");
        return [];
      }

      const allDevices = [];

      // Get devices from each organization
      for (const org of organizations) {
        try {
          const orgDevices = await this.getDevicesByOrganization(org.id);
          const devicesArray = Array.isArray(orgDevices)
            ? orgDevices
            : (orgDevices as any)?.devices &&
                Array.isArray((orgDevices as any).devices)
              ? (orgDevices as any).devices
              : [];

          const devicesWithOrgName = devicesArray.map((device: any) => ({
            ...device,
            organization_name: org.name,
          }));
          allDevices.push(...devicesWithOrgName);
        } catch (error) {
          console.error(
            `Failed to fetch devices for organization ${org.id}:`,
            error,
          );
        }
      }

      return allDevices;
    } catch (error) {
      console.error("Failed to fetch devices:", error);
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
      device_name: data.name || "RFID Device",
      device_model: data.device_model || "RFID Scanner",
      ip_address: data.ip_address || null,
    };

    return this.request("/devices", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
  }

  async updateDevice(
    serialNumber: string,
    data: {
      device_name?: string;
      serial_number?: string;
      organization_id?: number;
      device_model?: string;
      ip_address?: string;
      status?: string;
    },
  ) {
    // Check if updating organization only (use dedicated endpoint)
    if (data.organization_id && Object.keys(data).length === 1) {
      // Assign device to organization using dedicated endpoint
      return this.request(`/devices/${serialNumber}/organization`, {
        method: "PUT",
        body: JSON.stringify({ organization_id: data.organization_id }),
      });
    }

    // Build update payload with allowed fields
    const updatePayload: any = {};

    if (data.device_name !== undefined) updatePayload.device_name = data.device_name;
    if (data.device_model !== undefined) updatePayload.device_model = data.device_model;
    if (data.ip_address !== undefined) updatePayload.ip_address = data.ip_address;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.organization_id !== undefined) updatePayload.organization_id = data.organization_id;

    // Use the general update endpoint that now supports multiple fields
    return this.request(`/devices/${serialNumber}`, {
      method: "PUT",
      body: JSON.stringify(updatePayload),
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

  async updateAdmin(data: {
    id: number;
    username: string;
    email: string;
    password?: string;
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

  async impersonateAdmin(adminId: number) {
    return this.request(`/admins/${adminId}/impersonate`, {
      method: "POST",
    });
  }

  async exitImpersonation() {
    return this.request("/admins/exit-impersonation", {
      method: "POST",
    });
  }

  // User-Device Assignments
  async getUserDeviceAssignments(userId: number) {
    return this.request(`/users/${userId}/device-assignments`, {
      method: "GET",
    });
  }

  async assignUserToDevice(data: {
    user_id: number;
    device_id: number;
    organization_id: number;
  }) {
    return this.request(
      `/users/${data.user_id}/devices/${data.device_id}/assign`,
      {
        method: "POST",
        body: JSON.stringify({ organization_id: data.organization_id }),
      },
    );
  }

  async removeUserFromDevice(userId: number, deviceId: number) {
    return this.request(`/users/${userId}/devices/${deviceId}/assign`, {
      method: "DELETE",
    });
  }

  async getDeviceAssignments(deviceId: number) {
    return this.request(`/devices/${deviceId}/assignments`, {
      method: "GET",
    });
  }

  async bulkAssignUsersToDevice(data: {
    user_ids: number[];
    device_id: number;
    organization_id: number;
  }) {
    return this.request(`/devices/${data.device_id}/users/bulk-assign`, {
      method: "POST",
      body: JSON.stringify({ user_ids: data.user_ids }),
    });
  }

  async getOrganizationDeviceAssignments(organizationId: number) {
    return this.request(`/organizations/${organizationId}/device-assignments`, {
      method: "GET",
    });
  }

  // CSV Upload for Users
  async uploadUsersFromCSV(csvFile: File, organizationId?: number) {
    const formData = new FormData();
    formData.append("csv_file", csvFile);
    if (organizationId) {
      formData.append("organization_id", organizationId.toString());
    }

    const url = `${API_BASE_URL}/users/upload-csv`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    return response.json();
  }

  async downloadCSVTemplate() {
    const url = `${API_BASE_URL}/users/csv-template`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
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

    return response.text(); // Return as text for CSV
  }
}

export const apiClient = new ApiClient();
