import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
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
import { Textarea } from "../components/ui/textarea";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Users,
  Radio,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Settings,
  Power,
  PowerOff
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: "school" | "firm" | "government" | "healthcare";
  status: "active" | "inactive" | "suspended";
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  joinedDate: string;
  assignedDevices: number;
  totalUsers: number;
  departments: string[];
}

export default function Organizations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const organizations: Organization[] = [
    {
      id: "ORG-001",
      name: "TechCorp HQ",
      type: "firm",
      status: "active",
      address: "123 Innovation Drive, Tech City, TC 12345",
      contactPerson: "John Smith",
      email: "admin@techcorp.com",
      phone: "+1 (555) 123-4567",
      joinedDate: "2023-01-15",
      assignedDevices: 8,
      totalUsers: 345,
      departments: ["Engineering", "HR", "Finance", "Marketing", "Security"]
    },
    {
      id: "ORG-002",
      name: "Metro University",
      type: "school",
      status: "active",
      address: "456 Education Blvd, University Park, UP 67890",
      contactPerson: "Dr. Sarah Johnson",
      email: "admin@metrouniv.edu",
      phone: "+1 (555) 987-6543",
      joinedDate: "2023-03-20",
      assignedDevices: 12,
      totalUsers: 2847,
      departments: ["Computer Science", "Library", "Student Services", "Cafeteria", "Dormitories"]
    },
    {
      id: "ORG-003",
      name: "Innovation Lab",
      type: "firm",
      status: "active",
      address: "789 Research Way, Science Park, SP 24680",
      contactPerson: "Dr. Michael Chen",
      email: "contact@innovationlab.com",
      phone: "+1 (555) 456-7890",
      joinedDate: "2023-06-10",
      assignedDevices: 4,
      totalUsers: 89,
      departments: ["R&D", "Lab Operations", "Administration"]
    },
    {
      id: "ORG-004",
      name: "City General Hospital",
      type: "healthcare",
      status: "inactive",
      address: "321 Medical Center Dr, Healthcare City, HC 13579",
      contactPerson: "Dr. Emily Rodriguez",
      email: "admin@citygeneral.health",
      phone: "+1 (555) 321-0987",
      joinedDate: "2023-08-05",
      assignedDevices: 0,
      totalUsers: 156,
      departments: ["Emergency", "ICU", "Surgery", "Administration", "Pharmacy"]
    }
  ];

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "school":
        return "🎓";
      case "firm":
        return "🏢";
      case "government":
        return "🏛️";
      case "healthcare":
        return "🏥";
      default:
        return "🏢";
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      school: "bg-blue-100 text-blue-800 border-blue-200",
      firm: "bg-purple-100 text-purple-800 border-purple-200",
      government: "bg-gray-100 text-gray-800 border-gray-200",
      healthcare: "bg-red-100 text-red-800 border-red-200"
    };
    return <Badge className={colors[type as keyof typeof colors] || colors.firm}>{type}</Badge>;
  };

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Enter organization name" />
                </div>
                <div>
                  <Label htmlFor="org-type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">🎓 School/University</SelectItem>
                      <SelectItem value="firm">🏢 Business/Firm</SelectItem>
                      <SelectItem value="government">🏛️ Government</SelectItem>
                      <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="org-address">Address</Label>
                <Textarea id="org-address" placeholder="Enter full address" className="min-h-16" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input id="contact-person" placeholder="Full name" />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="email@organization.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input id="contact-phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="departments">Departments (comma-separated)</Label>
                <Input id="departments" placeholder="HR, Finance, Engineering, etc." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Organization</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search organizations by name, contact person, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="school">Schools</SelectItem>
                <SelectItem value="firm">Firms</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrganizations.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(org.type)}</div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      {getTypeBadge(org.type)}
                      <span className="text-xs text-muted-foreground">ID: {org.id}</span>
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(org.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{org.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{org.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{org.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{org.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{new Date(org.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Radio className="h-4 w-4 text-primary" />
                    <span className="text-lg font-semibold">{org.assignedDevices}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Devices</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-lg font-semibold">{org.totalUsers.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-lg font-semibold">{org.departments.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Departments</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Departments:</p>
                <div className="flex flex-wrap gap-1">
                  {org.departments.slice(0, 3).map((dept) => (
                    <Badge key={dept} variant="outline" className="text-xs">
                      {dept}
                    </Badge>
                  ))}
                  {org.departments.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{org.departments.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedOrg(org)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Organization: {selectedOrg?.name}</DialogTitle>
                      <DialogDescription>
                        Update organization details and device assignments.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedOrg && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-name">Organization Name</Label>
                            <Input id="edit-name" defaultValue={selectedOrg.name} />
                          </div>
                          <div>
                            <Label htmlFor="edit-contact">Contact Person</Label>
                            <Input id="edit-contact" defaultValue={selectedOrg.contactPerson} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" defaultValue={selectedOrg.email} />
                          </div>
                          <div>
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input id="edit-phone" defaultValue={selectedOrg.phone} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="edit-address">Address</Label>
                          <Textarea id="edit-address" defaultValue={selectedOrg.address} className="min-h-16" />
                        </div>
                        <div>
                          <Label htmlFor="edit-departments">Departments</Label>
                          <Input id="edit-departments" defaultValue={selectedOrg.departments.join(", ")} />
                        </div>
                        <div>
                          <Label htmlFor="device-assignment">Assign Devices</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select devices to assign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dev-001">DEV-001 - Main Entrance Scanner</SelectItem>
                              <SelectItem value="dev-002">DEV-002 - Lab Access Reader</SelectItem>
                              <SelectItem value="dev-003">DEV-003 - Parking Gate Scanner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsEditDialogOpen(false)}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {org.status === "active" ? (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <PowerOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                    <Power className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
