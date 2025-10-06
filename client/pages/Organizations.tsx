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
import { Textarea } from "../components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  address?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export default function Organizations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_person: "",
    email: "",
    phone: "",
  });

  const queryClient = useQueryClient();

  const {
    data: organizationsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.getOrganizations(),
  });

  // Ensure we always have an array to work with
  const organizations = Array.isArray(organizationsResponse)
    ? organizationsResponse
    : (organizationsResponse as any)?.organizations
      ? Array.isArray((organizationsResponse as any).organizations)
        ? (organizationsResponse as any).organizations
        : []
      : [];

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        address: "",
        contact_person: "",
        email: "",
        phone: "",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Organization> }) =>
      apiClient.updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setIsEditDialogOpen(false);
      setSelectedOrg(null);
    },
  });

  const statusToggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      apiClient.updateOrganization(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  const filteredOrganizations = organizations.filter(
    (org: Organization) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.contact_person || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (org.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrg) {
      updateMutation.mutate({
        id: selectedOrg.id,
        data: {
          name: selectedOrg.name,
          address: selectedOrg.address,
          contact_person: selectedOrg.contact_person,
          email: selectedOrg.email,
          phone: selectedOrg.phone,
        },
      });
    }
  };

  const handleStatusToggle = (org: Organization) => {
    const newStatus = org.status === 'active' ? 'inactive' : 'active';
    statusToggleMutation.mutate({
      id: org.id,
      status: newStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading organizations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <div className="text-center">
          <p>Error loading organizations</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log("Organizations response:", organizationsResponse);
  console.log("Processed organizations:", organizations);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage schools, firms, and other organizations with device access
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Organization</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>
                Register a new school, firm, or organization to the RFID system.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleCreateOrganization}
              className="grid gap-4 py-4"
            >
              <div>
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="org-address">Address</Label>
                <Textarea
                  id="org-address"
                  placeholder="Enter full address"
                  className="min-h-16"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input
                    id="contact-person"
                    placeholder="Full name"
                    value={formData.contact_person}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_person: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="email@organization.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
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
                onClick={handleCreateOrganization}
              >
                {createMutation.isPending ? "Adding..." : "Add Organization"}
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
              placeholder="Search organizations by name, contact person, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrganizations.map((org: Organization) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏢</div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      ID: {org.id}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={
                    org.status === 'active'
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  <div className="flex items-center space-x-1">
                    {org.status === 'active' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{org.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {org.address && (
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{org.address}</span>
                  </div>
                )}
                {org.contact_person && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Contact:</span>
                    <span>{org.contact_person}</span>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{org.email}</span>
                  </div>
                )}
                {org.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{org.phone}</span>
                  </div>
                )}
                {org.created_at && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(org.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedOrg(org);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={org.status === 'active' ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleStatusToggle(org)}
                  disabled={statusToggleMutation.isPending}
                >
                  {org.status === 'active' ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Organization: {selectedOrg?.name}</DialogTitle>
            <DialogDescription>Update organization details.</DialogDescription>
          </DialogHeader>
          {selectedOrg && (
            <form
              onSubmit={handleUpdateOrganization}
              className="grid gap-4 py-4"
            >
              <div>
                <Label htmlFor="edit-name">Organization Name</Label>
                <Input
                  id="edit-name"
                  value={selectedOrg.name}
                  onChange={(e) =>
                    setSelectedOrg({ ...selectedOrg, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={selectedOrg.address || ""}
                  onChange={(e) =>
                    setSelectedOrg({ ...selectedOrg, address: e.target.value })
                  }
                  className="min-h-16"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contact">Contact Person</Label>
                  <Input
                    id="edit-contact"
                    value={selectedOrg.contact_person || ""}
                    onChange={(e) =>
                      setSelectedOrg({
                        ...selectedOrg,
                        contact_person: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={selectedOrg.email || ""}
                    onChange={(e) =>
                      setSelectedOrg({ ...selectedOrg, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedOrg.phone || ""}
                  onChange={(e) =>
                    setSelectedOrg({ ...selectedOrg, phone: e.target.value })
                  }
                />
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
              onClick={handleUpdateOrganization}
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
