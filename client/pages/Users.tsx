import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import {
  useUsers,
  useOrganizations,
  useCreateUser,
  useActivateUser,
  useDeactivateUser,
  useCreateAdmin,
  useAdmins,
} from "../hooks/useApi";
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
import { Alert, AlertDescription } from "../components/ui/alert";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Users,
  Plus,
  Search,
  Edit,
  Building2,
  Mail,
  Phone,
  UserX,
  Calendar,
  Loader2,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface User {
  punching_code: string;
  name: string;
  phone_number: string;
  email: string;
  organization_id?: number;
  organization_name?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  // Frontend display fields
  id?: string;
  category: "customer";
}

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

interface UserFormData {
  name: string;
  punching_code: string;
  phone: string;
  email: string;
  organization_id: number;
}

interface AdminFormData {
  username: string;
  email: string;
  password: string;
  role: "super_admin" | "admin";
  organization_id?: number;
}

const initialFormData: UserFormData = {
  name: "",
  punching_code: "",
  phone: "",
  email: "",
  organization_id: 0,
};

const initialAdminFormData: AdminFormData = {
  username: "",
  email: "",
  password: "",
  role: "admin",
  organization_id: undefined,
};

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [adminFormData, setAdminFormData] =
    useState<AdminFormData>(initialAdminFormData);

  const { toast } = useToast();

  const {
    data: usersResponse = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers();

  const { data: organizationsResponse = [], isLoading: orgsLoading } =
    useOrganizations();

  const {
    data: adminsResponse = [],
    isLoading: adminsLoading,
    error: adminsError,
    refetch: refetchAdmins,
  } = useAdmins();

  const createUserMutation = useCreateUser();
  const createAdminMutation = useCreateAdmin();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  // Handle success and error for create user
  const handleCreateUser = async (data: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      setFormData(initialFormData);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "User created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user.",
        variant: "destructive",
      });
    }
  };

  // Handle success and error for create admin
  const handleCreateAdmin = async (data: AdminFormData) => {
    try {
      await createAdminMutation.mutateAsync(data);
      setAdminFormData(initialAdminFormData);
      setIsAddAdminDialogOpen(false);
      refetchAdmins(); // Refresh admins list
      toast({
        title: "Success",
        description: "Admin created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin.",
        variant: "destructive",
      });
    }
  };

  // Handle activate user
  const handleActivateUser = async (punchingCode: string) => {
    try {
      await activateUserMutation.mutateAsync(punchingCode);
      toast({
        title: "Success",
        description: "User activated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate user.",
        variant: "destructive",
      });
    }
  };

  // Handle deactivate user
  const handleDeactivateUser = async (punchingCode: string) => {
    try {
      await deactivateUserMutation.mutateAsync(punchingCode);
      toast({
        title: "Success",
        description: "User deactivated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate user.",
        variant: "destructive",
      });
    }
  };

  const users = Array.isArray(usersResponse)
    ? usersResponse
    : (usersResponse as any)?.users
      ? Array.isArray((usersResponse as any).users)
        ? (usersResponse as any).users
        : []
      : [];

  const organizations = Array.isArray(organizationsResponse)
    ? organizationsResponse
    : (organizationsResponse as any)?.organizations
      ? Array.isArray((organizationsResponse as any).organizations)
        ? (organizationsResponse as any).organizations
        : []
      : [];

  const admins = Array.isArray(adminsResponse)
    ? adminsResponse
    : (adminsResponse as any)?.admins
      ? Array.isArray((adminsResponse as any).admins)
        ? (adminsResponse as any).admins
        : []
      : [];

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.punching_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrganization =
      !selectedOrganization ||
      selectedOrganization === "all" ||
      user.organization_id?.toString() === selectedOrganization;

    return matchesSearch && matchesOrganization;
  });

  const filteredAdmins = admins.filter((admin: Admin) => {
    const matchesSearch =
      admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrganization =
      !selectedOrganization ||
      selectedOrganization === "all" ||
      admin.organization_id?.toString() === selectedOrganization;

    return matchesSearch && matchesOrganization;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.organization_id === 0) {
      toast({
        title: "Error",
        description: "Please select an organization.",
        variant: "destructive",
      });
      return;
    }
    await handleCreateUser(formData);
  };

  const handleCreateAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminFormData.role === "admin" && !adminFormData.organization_id) {
      toast({
        title: "Error",
        description: "Please select an organization for admin role.",
        variant: "destructive",
      });
      return;
    }
    await handleCreateAdmin(adminFormData);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "1":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
      case "0":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isUserActive = (status: string) => {
    return status?.toLowerCase() === "active" || status === "1";
  };

  if (usersLoading || orgsLoading || adminsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage customer accounts and access permissions
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (usersError || adminsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage customer accounts and access permissions
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load data: {(usersError as any)?.message || (adminsError as any)?.message}
          </AlertDescription>
        </Alert>

        <div className="flex space-x-2">
          <Button onClick={() => refetchUsers()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Users
          </Button>
          <Button onClick={() => refetchAdmins()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Admins
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer accounts and access permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog
            open={isAddAdminDialogOpen}
            onOpenChange={setIsAddAdminDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreateAdminSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Admin</DialogTitle>
                  <DialogDescription>
                    Create a new admin account with management permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username *</Label>
                    <Input
                      id="admin-username"
                      value={adminFormData.username}
                      onChange={(e) =>
                        setAdminFormData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="Enter admin name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address *</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminFormData.email}
                      onChange={(e) =>
                        setAdminFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter admin email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password *</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={adminFormData.password}
                      onChange={(e) =>
                        setAdminFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter admin password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-role">Role *</Label>
                    <Select
                      value={adminFormData.role}
                      onValueChange={(value: "super_admin" | "admin") =>
                        setAdminFormData((prev) => ({ ...prev, role: value }))
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
                  {adminFormData.role === "admin" && (
                    <div className="space-y-2">
                      <Label htmlFor="admin-organization">Organization *</Label>
                      <Select
                        value={adminFormData.organization_id?.toString() || ""}
                        onValueChange={(value) =>
                          setAdminFormData((prev) => ({
                            ...prev,
                            organization_id: value
                              ? parseInt(value)
                              : undefined,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org: any) => (
                            <SelectItem key={org.id} value={org.id.toString()}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddAdminDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createAdminMutation.isPending}
                  >
                    {createAdminMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Admin"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreateSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new customer account in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name *</Label>
                    <Input
                      id="user-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="punching-code">Punching Code *</Label>
                    <Input
                      id="punching-code"
                      value={formData.punching_code}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          punching_code: e.target.value,
                        }))
                      }
                      placeholder="e.g., EMP001 or unique identifier"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="e.g., +1 (555) 123-4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="e.g., john.doe@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Select
                      value={
                        formData.organization_id > 0
                          ? formData.organization_id.toString()
                          : ""
                      }
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          organization_id: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org: any) => (
                          <SelectItem key={org.id} value={org.id.toString()}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "admins")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="admins">Admins ({filteredAdmins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, punching code, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedOrganization}
              onValueChange={setSelectedOrganization}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org: any) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => refetchUsers()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>All Users ({filteredUsers.length})</span>
          </CardTitle>
          <CardDescription>
            Customer accounts with access management controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Punching Code</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: User) => (
                  <TableRow key={user.punching_code}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Customer
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {user.punching_code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{user.phone_number || "No phone"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.organization_name && (
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {user.organization_name}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.created_at && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span>
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {isUserActive(user.status) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeactivateUser(user.punching_code)
                            }
                            disabled={deactivateUserMutation.isPending}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                          >
                            {deactivateUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleActivateUser(user.punching_code)
                            }
                            disabled={activateUserMutation.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            {activateUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Users Found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                (selectedOrganization && selectedOrganization !== "all")
                  ? "No users match your current filters."
                  : "Get started by adding your first customer."}
              </p>
              {!searchTerm &&
                (!selectedOrganization || selectedOrganization === "all") && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          {/* Admins Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedOrganization}
                  onValueChange={setSelectedOrganization}
                >
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue placeholder="All Organizations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {organizations.map((org: any) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => refetchAdmins()} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admins Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>All Admins ({filteredAdmins.length})</span>
              </CardTitle>
              <CardDescription>
                Administrator accounts with management permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin: Admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span>{admin.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{admin.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {admin.organization_name ? (
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{admin.organization_name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Global</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {admin.created_at && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span>
                                  {new Date(admin.created_at).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(admin.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredAdmins.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Admins Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ||
                    (selectedOrganization && selectedOrganization !== "all")
                      ? "No admins match your current filters."
                      : "Get started by adding your first admin."}
                  </p>
                  {!searchTerm &&
                    (!selectedOrganization || selectedOrganization === "all") && (
                      <Button onClick={() => setIsAddAdminDialogOpen(true)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Add Admin
                      </Button>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
