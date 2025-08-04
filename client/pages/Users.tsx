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
  UserX
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
  status: "active" | "inactive" | "suspended";
  assignedDevices: string[];
  cardNumber?: string;
  cardStatus: "active" | "inactive" | "lost" | "expired";
  biometricEnabled: boolean;
  joinedDate: string;
  lastAccess: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
      status: "active",
      assignedDevices: ["DEV-001"],
      cardNumber: "CARD-007890",
      cardStatus: "active",
      biometricEnabled: false,
      joinedDate: "2024-01-05",
      lastAccess: "5 hours ago"
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || user.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
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
            Manage users, categories, and device assignments
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
                        <SelectItem value="techcorp">TechCorp HQ</SelectItem>
                        <SelectItem value="metro-university">Metro University</SelectItem>
                        <SelectItem value="innovation-lab">Innovation Lab</SelectItem>
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
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
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
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
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit User: {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
                            <DialogDescription>
                              Update user information and device assignments.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <Tabs defaultValue="profile" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="devices">Devices</TabsTrigger>
                                <TabsTrigger value="access">Access</TabsTrigger>
                              </TabsList>
                              <TabsContent value="profile" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-firstName">First Name</Label>
                                    <Input id="edit-firstName" defaultValue={selectedUser.firstName} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-lastName">Last Name</Label>
                                    <Input id="edit-lastName" defaultValue={selectedUser.lastName} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input id="edit-email" defaultValue={selectedUser.email} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input id="edit-phone" defaultValue={selectedUser.phone} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select defaultValue={selectedUser.category}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="visitor">Visitor</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Input id="edit-department" defaultValue={selectedUser.department} />
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="devices" className="space-y-4">
                                <div>
                                  <Label>Assigned Devices</Label>
                                  <div className="space-y-2 mt-2">
                                    {selectedUser.assignedDevices.map(deviceId => (
                                      <div key={deviceId} className="flex items-center justify-between p-2 border rounded">
                                        <span>{deviceId}</span>
                                        <Button variant="outline" size="sm">Remove</Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label>Add New Device</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select device" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="dev-001">DEV-001 - Main Entrance</SelectItem>
                                      <SelectItem value="dev-002">DEV-002 - Lab Access</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TabsContent>
                              <TabsContent value="access" className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <input 
                                    type="checkbox" 
                                    id="biometric" 
                                    defaultChecked={selectedUser.biometricEnabled}
                                    className="rounded" 
                                  />
                                  <Label htmlFor="biometric">Enable Biometric Authentication</Label>
                                </div>
                                <div>
                                  <Label htmlFor="card-number">Card Number</Label>
                                  <Input id="card-number" defaultValue={selectedUser.cardNumber} />
                                </div>
                                <div>
                                  <Label htmlFor="card-status">Card Status</Label>
                                  <Select defaultValue={selectedUser.cardStatus}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                      <SelectItem value="lost">Lost</SelectItem>
                                      <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
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
    </div>
  );
}
