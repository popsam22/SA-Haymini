import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Mail,
  Building2,
  Shield,
  User,
  Calendar,
  ExternalLink,
  LogIn,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Admin {
  id: number;
  username: string;
  email: string;
  role: "super_admin" | "admin";
  organization_id?: number;
  organization_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface Organization {
  id: number;
  name: string;
}

export default function Admins() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin" as "super_admin" | "admin",
    organization_id: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: adminsResponse,
    isLoading: isLoadingAdmins,
    error: adminsError,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: () => apiClient.getAdmins(),
  });

  const {
    data: organizationsResponse,
    isLoading: isLoadingOrgs,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.getOrganizations(),
  });

  // Process admins data
  const admins = Array.isArray(adminsResponse)
    ? adminsResponse
    : (adminsResponse as any)?.admins
      ? Array.isArray((adminsResponse as any).admins)
        ? (adminsResponse as any).admins
        : []
      : [];

  // Process organizations data
  const organizations = Array.isArray(organizationsResponse)
    ? organizationsResponse
    : (organizationsResponse as any)?.organizations
      ? Array.isArray((organizationsResponse as any).organizations)
        ? (organizationsResponse as any).organizations
        : []
      : [];

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      apiClient.createAdmin({
        ...data,
        organization_id: data.organization_id ? parseInt(data.organization_id) : undefined,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsAddDialogOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "admin",
        organization_id: "",
      });

      if (response.status === 'success') {
        toast({
          title: "Admin Created",
          description: "Admin account created successfully. Welcome email sent to the admin.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Admin> }) =>
      apiClient.updateAdmin({
        id,
        username: data.username!,
        email: data.email!,
        role: data.role!,
        organization_id: data.organization_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsEditDialogOpen(false);
      setSelectedAdmin(null);
      toast({
        title: "Admin Updated",
        description: "Admin details updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin",
        variant: "destructive",
      });
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: (adminId: number) =>
      apiClient.request(`/admins/${adminId}/impersonate`, {
        method: "POST",
      }),
    onSuccess: (response: any) => {
      // Check if backend returns a token for admin portal
      if (response.token || response.impersonation_token) {
        const token = response.token || response.impersonation_token;
        // Construct admin portal URL with token
        const adminPortalUrl = `https://haymini-app.netlify.app/login?token=${encodeURIComponent(token)}`;
        window.open(adminPortalUrl, '_blank');
        toast({
          title: "Impersonation Started",
          description: "Opening admin portal in new window.",
        });
      } else if (response.admin_portal_url) {
        // Fallback to backend-provided URL
        window.open(response.admin_portal_url, '_blank');
        toast({
          title: "Impersonation Started",
          description: "Opening admin portal in new window.",
        });
      } else {
        toast({
          title: "Error",
          description: "No impersonation token received from server",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to impersonate admin",
        variant: "destructive",
      });
    },
  });

  const filteredAdmins = admins.filter(
    (admin: Admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.organization_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAdmin) {
      updateMutation.mutate({
        id: selectedAdmin.id,
        data: {
          username: selectedAdmin.username,
          email: selectedAdmin.email,
          role: selectedAdmin.role,
          organization_id: selectedAdmin.organization_id,
        },
      });
    }
  };

  const handleImpersonate = (admin: Admin) => {
    if (admin.role === 'super_admin') {
      toast({
        title: "Cannot Impersonate",
        description: "Cannot impersonate another super admin.",
        variant: "destructive",
      });
      return;
    }
    impersonateMutation.mutate(admin.id);
  };

  if (isLoadingAdmins || isLoadingOrgs) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading administrators...
      </div>
    );
  }

  if (adminsError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <div className="text-center">
          <p>Error loading administrators</p>
          <p className="text-sm text-gray-500 mt-2">
            {adminsError instanceof Error ? adminsError.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administrators</h1>
          <p className="text-muted-foreground mt-1">
            Manage system administrators and organization admins
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Admin</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
              <DialogDescription>
                Create a new admin account. An email with login credentials will be sent automatically.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAdmin} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin-username">Username *</Label>
                  <Input
                    id="admin-username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="admin-password">Password *</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin-role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "super_admin" | "admin") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="admin-org">Organization</Label>
                  <Select
                    value={formData.organization_id || "none"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, organization_id: value === "none" ? "" : value })
                    }
                    disabled={formData.role === "super_admin"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Organization</SelectItem>
                      {organizations.map((org: Organization) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                onClick={handleCreateAdmin}
              >
                {createMutation.isPending ? "Creating..." : "Create Admin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search admins by username, email, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAdmins.map((admin: Admin) => (
          <Card key={admin.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {admin.role === 'super_admin' ? '👑' : '👤'}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{admin.username}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      ID: {admin.id}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={
                    admin.role === 'super_admin'
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }
                >
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{admin.email}</span>
                </div>

                {admin.organization_name && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Org:</span>
                    <span>{admin.organization_name}</span>
                  </div>
                )}

                {admin.created_at && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(admin.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedAdmin(admin);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {admin.role !== 'super_admin' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleImpersonate(admin)}
                    disabled={impersonateMutation.isPending}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login As
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Admin: {selectedAdmin?.username}</DialogTitle>
            <DialogDescription>Update admin details.</DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <form onSubmit={handleUpdateAdmin} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={selectedAdmin.username}
                    onChange={(e) =>
                      setSelectedAdmin({ ...selectedAdmin, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={selectedAdmin.email}
                    onChange={(e) =>
                      setSelectedAdmin({ ...selectedAdmin, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={selectedAdmin.role}
                    onValueChange={(value: "super_admin" | "admin") =>
                      setSelectedAdmin({ ...selectedAdmin, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-org">Organization</Label>
                  <Select
                    value={selectedAdmin.organization_id?.toString() || "none"}
                    onValueChange={(value) =>
                      setSelectedAdmin({
                        ...selectedAdmin,
                        organization_id: value === "none" ? undefined : parseInt(value),
                      })
                    }
                    disabled={selectedAdmin.role === "super_admin"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Organization</SelectItem>
                      {organizations.map((org: Organization) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAdmin}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}