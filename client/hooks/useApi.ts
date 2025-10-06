import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

// Organizations
export const useOrganizations = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => apiClient.getOrganizations(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrganization = (id: number) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => apiClient.getOrganization(id),
    enabled: isAuthenticated && !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      name: string;
      address?: string;
      contact_person?: string;
      email?: string;
      phone?: string;
    }) => apiClient.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: {
      id: number;
      name?: string;
      address?: string;
      contact_person?: string;
      email?: string;
      phone?: string;
    }) => apiClient.updateOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
  });
};

// Users
export const useUsers = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUsersByOrganization = (organizationId: number) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['organizations', organizationId, 'users'],
    queryFn: () => apiClient.getUsersByOrganization(organizationId),
    enabled: isAuthenticated && !!organizationId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      punching_code: string;
      phone: string;
      email: string;
      organization_id: number;
    }) => apiClient.createUser(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({
        queryKey: ['organizations', variables.organization_id, 'users']
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      punching_code: string;
      phone: string;
      email: string;
      organization_id?: number;
    }) => apiClient.updateUser(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (variables.organization_id) {
        queryClient.invalidateQueries({
          queryKey: ['organizations', variables.organization_id, 'users']
        });
      }
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (punchingCode: string) => apiClient.activateUser(punchingCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (punchingCode: string) => apiClient.deactivateUser(punchingCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Devices
export const useDevices = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => apiClient.getDevices(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDevicesByOrganization = (organizationId: number) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['organizations', organizationId, 'devices'],
    queryFn: () => apiClient.getDevicesByOrganization(organizationId),
    enabled: isAuthenticated && !!organizationId,
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      serial_number: string;
      organization_id: number;
      device_model?: string;
      ip_address?: string;
      status?: string;
    }) => apiClient.createDevice(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ 
        queryKey: ['organizations', variables.organization_id, 'devices'] 
      });
    },
  });
};

// Logs (Attendance Records)
export const useLogs = (params?: {
  organization_id?: number;
  user_id?: number;
  device_id?: number;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => apiClient.getLogs(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLogsByOrganization = (organizationId: number) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['organizations', organizationId, 'logs'],
    queryFn: () => apiClient.getLogsByOrganization(organizationId),
    enabled: isAuthenticated && !!organizationId,
    staleTime: 2 * 60 * 1000,
  });
};

// Admin Management (Super Admin only)
export const useAdmins = () => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['admins'],
    queryFn: () => apiClient.getAdmins(),
    enabled: isAuthenticated && user?.role === 'super_admin',
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      username: string;
      email: string;
      password: string;
      role: 'super_admin' | 'admin';
      organization_id?: number;
    }) => apiClient.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: number;
      username: string;
      email: string;
      password?: string;
      role: 'super_admin' | 'admin';
      organization_id?: number;
    }) => apiClient.updateAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

// User Logs by punching code
export const useUserLogs = (punchingCode: string, organizationId?: number) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['user-logs', punchingCode, organizationId],
    queryFn: () => apiClient.getUserLogs(punchingCode, organizationId),
    enabled: isAuthenticated && !!punchingCode,
    staleTime: 2 * 60 * 1000,
  });
};