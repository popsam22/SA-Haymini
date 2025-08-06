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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Users,
  Plus,
  Search,
  Edit,
  Upload,
  Download,
  Power,
  PowerOff,
  Building2,
  Radio,
  Shield,
  Calendar,
  Mail,
  Phone,
  FileText,
  UserCheck,
  UserX,
  Filter,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  category: "staff" | "customer" | "visitor";
  department: string;
  organization: string;
  organizationId: string;
  status: "active" | "inactive" | "suspended";
  assignedDevices: string[];
  cardNumber?: string;
  cardStatus: "active" | "inactive" | "lost" | "expired";
  biometricEnabled: boolean;
  joinedDate: string;
  lastAccess: string;
}

interface Organization {
  id: string;
  name: string;
  totalUsers: number;
  activeUsers: number;
  departments: string[];
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"organization" | "list">("organization");

  const organizations: Organization[] = [
    {
      id: "ORG-001",
      name: "TechCorp HQ",
      totalUsers: 345,
      activeUsers: 298,
      departments: ["Engineering", "HR", "Finance", "Marketing", "Security"]
    },
    {
      id: "ORG-002", 
      name: "Metro University",
      totalUsers: 1847,
      activeUsers: 1634,
      departments: ["Computer Science", "Library", "Student Services", "Cafeteria", "Dormitories"]
    },
    {
      id: "ORG-003",
      name: "Innovation Lab",
      totalUsers: 89,
      activeUsers: 76,
      departments: ["R&D", "Lab Operations", "Administration"]
    }
  ];

  const users: User[] = [
    {
      id: "USR-001",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@techcorp.com",
      phone: "+1 (555) 123-4567",
      employeeId: "TC001",
      category: "staff",
      department: "Engineering",
      organization: "TechCorp HQ",
      organizationId: "ORG-001",
      status: "active",
      assignedDevices: ["DEV-001", "DEV-002"],
      cardNumber: "CARD-001234",
      cardStatus: "active",
      biometricEnabled: true,
      joinedDate: "2023-01-15",
      lastAccess: "2 hours ago"
    },
    {
      id: "USR-002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "s.johnson@metrouniv.edu",
      phone: "+1 (555) 987-6543",
      employeeId: "MU002",
      category: "staff",
      department: "Library",
      organization: "Metro University",
      organizationId: "ORG-002",
      status: "active",
      assignedDevices: ["DEV-004", "DEV-005"],
      cardNumber: "CARD-005678",
      cardStatus: "active",
      biometricEnabled: false,
      joinedDate: "2023-03-20",
      lastAccess: "1 day ago"
    },
    {
      id: "USR-003",
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@student.metrouniv.edu",
      phone: "+1 (555) 456-7890",
      employeeId: "ST003",
      category: "customer",
      department: "Computer Science",
      organization: "Metro University",
      organizationId: "ORG-002",
      status: "active",
      assignedDevices: ["DEV-004"],
      cardNumber: "CARD-009012",
      cardStatus: "active",
      biometricEnabled: true,
      joinedDate: "2023-09-01",
      lastAccess: "30 min ago"
    },
    {
      id: "USR-004",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.r@innovationlab.com",
      phone: "+1 (555) 321-0987",
      employeeId: "IL004",
      category: "staff",
      department: "R&D",
      organization: "Innovation Lab",
      organizationId: "ORG-003",
      status: "inactive",
      assignedDevices: ["DEV-003"],
      cardNumber: "CARD-003456",
      cardStatus: "inactive",
      biometricEnabled: false,
      joinedDate: "2023-06-10",
      lastAccess: "1 week ago"
    },
    {
      id: "USR-005",
      firstName: "David",
      lastName: "Wilson",
      email: "d.wilson@visitor.com",
      phone: "+1 (555) 654-3210",
      employeeId: "VIS005",
      category: "visitor",
      department: "Visitor",
      organization: "TechCorp HQ",
      organizationId: "ORG-001",
      status: "active",
      assignedDevices: ["DEV-001"],
      cardNumber: "CARD-007890",
      cardStatus: "active",
      biometricEnabled: false,
      joinedDate: "2024-01-05",
      lastAccess: "5 hours ago"
    },
    {
      id: "USR-006",
      firstName: "Lisa",
      lastName: "Wang",
      email: "l.wang@techcorp.com",
      phone: "+1 (555) 111-2222",
      employeeId: "TC002",
      category: "staff",
      department: "HR",
      organization: "TechCorp HQ",
      organizationId: "ORG-001",
      status: "active",
      assignedDevices: ["DEV-001"],
      cardNumber: "CARD-001235",
      cardStatus: "active",
      biometricEnabled: true,
      joinedDate: "2023-02-01",
      lastAccess: "4 hours ago"
    },
    {
      id: "USR-007",
      firstName: "Robert",
      lastName: "Thompson",
      email: "r.thompson@metrouniv.edu",
      phone: "+1 (555) 333-4444",
      employeeId: "MU003",
      category: "staff",
      department: "Student Services",
      organization: "Metro University",
      organizationId: "ORG-002",
      status: "active",
      assignedDevices: ["DEV-004"],
      cardNumber: "CARD-005679",
      cardStatus: "active",
      biometricEnabled: false,
      joinedDate: "2023-04-10",
      lastAccess: "6 hours ago"
    }
  ];

  const getUsersByOrganization = (orgId: string) => {
    return users.filter(user => user.organizationId === orgId);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || user.category === selectedCategory;
    const matchesOrg = selectedOrganization === "all" || user.organizationId === selectedOrganization;
    
    return matchesSearch && matchesCategory && matchesOrg;
  });

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

  const getCategoryBadge = (category: string) => {
    const colors = {
      staff: "bg-blue-100 text-blue-800 border-blue-200",
      customer: "bg-purple-100 text-purple-800 border-purple-200",
      visitor: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return <Badge className={colors[category as keyof typeof colors]}>{category}</Badge>;
  };

  const getCardStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case "lost":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Lost</Badge>;
      case "expired":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    staff: users.filter(u => u.category === "staff").length,
    customers: users.filter(u => u.category === "customer").length,
    visitors: users.filter(u => u.category === "visitor").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users across organizations, categories, and device assignments
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isCsvUploadOpen} onOpenChange={setIsCsvUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Users from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to bulk import user information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Required columns: firstName, lastName, email, phone, employeeId, category, department, organization</p>
                  <Button variant="link" className="px-0 h-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download sample CSV template
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCsvUploadOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCsvUploadOpen(false)}>Import Users</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign them to an organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Smith" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.smith@company.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeId">Employee/Student ID</Label>
                    <Input id="employeeId" placeholder="EMP001" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="customer">Customer/Student</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Engineering" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="devices">Assign Devices</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select devices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev-001">DEV-001 - Main Entrance Scanner</SelectItem>
                      <SelectItem value="dev-002">DEV-002 - Lab Access Reader</SelectItem>
                      <SelectItem value="dev-003">DEV-003 - Parking Gate Scanner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.staff}</div>
              <p className="text-xs text-muted-foreground">Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.customers}</div>
              <p className="text-xs text-muted-foreground">Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.visitors}</div>
              <p className="text-xs text-muted-foreground">Visitors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "organization" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("organization")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                By Organization
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Users className="h-4 w-4 mr-2" />
                List View
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="visitor">Visitors</SelectItem>
              </SelectContent>
            </Select>
            {viewMode === "list" && (
              <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "organization" ? (
        // Organization-based view
        <div className="space-y-6">
          <Accordion type="multiple" className="w-full space-y-4">
            {organizations.map((org) => {
              const orgUsers = getUsersByOrganization(org.id).filter(user => {
                const matchesSearch = 
                  user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === "all" || user.category === selectedCategory;
                return matchesSearch && matchesCategory;
              });

              return (
                <Card key={org.id}>
                  <AccordionItem value={org.id} className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center space-x-4">
                          <Building2 className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <h3 className="text-lg font-semibold">{org.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {orgUsers.length} users ({org.activeUsers} active)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{orgUsers.filter(u => u.category === 'staff').length}</div>
                            <div className="text-muted-foreground">Staff</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-600">{orgUsers.filter(u => u.category === 'customer').length}</div>
                            <div className="text-muted-foreground">Customers</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-orange-600">{orgUsers.filter(u => u.category === 'visitor').length}</div>
                            <div className="text-muted-foreground">Visitors</div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Card Status</TableHead>
                            <TableHead>Devices</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Access</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orgUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                  <div className="text-xs text-muted-foreground">ID: {user.employeeId}</div>
                                </div>
                              </TableCell>
                              <TableCell>{getCategoryBadge(user.category)}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <div>
                                  {getCardStatusBadge(user.cardStatus)}
                                  {user.cardNumber && (
                                    <div className="text-xs text-muted-foreground mt-1">{user.cardNumber}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Radio className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{user.assignedDevices.length}</span>
                                  {user.biometricEnabled && (
                                    <Shield className="h-3 w-3 text-green-600 ml-1" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{user.lastAccess}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {user.status === "active" ? (
                                    <Button variant="outline" size="sm" className="text-red-600">
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm" className="text-green-600">
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              );
            })}
          </Accordion>
        </div>
      ) : (
        // List view
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Complete list of users across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Card Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Access</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">ID: {user.employeeId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(user.category)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.organization}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <div>
                        {getCardStatusBadge(user.cardStatus)}
                        {user.cardNumber && (
                          <div className="text-xs text-muted-foreground mt-1">{user.cardNumber}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Radio className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.assignedDevices.length}</span>
                        {user.biometricEnabled && (
                          <Shield className="h-3 w-3 text-green-600 ml-1" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastAccess}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button variant="outline" size="sm" className="text-red-600">
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="text-green-600">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
