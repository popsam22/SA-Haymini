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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Power,
  PowerOff,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  Radio,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface CardInfo {
  id: string;
  cardNumber: string;
  cardType: "RFID" | "NFC" | "Mifare" | "Proximity";
  status: "active" | "inactive" | "lost" | "expired" | "blocked";
  userId: string;
  userName: string;
  userEmail: string;
  organization: string;
  department: string;
  assignedDevices: string[];
  issueDate: string;
  expiryDate: string;
  lastUsed: string;
  accessCount: number;
  biometricLinked: boolean;
  securityLevel: "low" | "medium" | "high";
}

export default function Cards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReportLostOpen, setIsReportLostOpen] = useState(false);

  const cards: CardInfo[] = [
    {
      id: "CARD-001",
      cardNumber: "1234567890123456",
      cardType: "RFID",
      status: "active",
      userId: "USR-001",
      userName: "John Smith",
      userEmail: "john.smith@techcorp.com",
      organization: "TechCorp HQ",
      department: "Engineering",
      assignedDevices: ["DEV-001", "DEV-002"],
      issueDate: "2023-01-15",
      expiryDate: "2024-01-15",
      lastUsed: "2 hours ago",
      accessCount: 1247,
      biometricLinked: true,
      securityLevel: "high"
    },
    {
      id: "CARD-002",
      cardNumber: "2345678901234567",
      cardType: "NFC",
      status: "active",
      userId: "USR-002",
      userName: "Sarah Johnson",
      userEmail: "s.johnson@metrouniv.edu",
      organization: "Metro University",
      department: "Library",
      assignedDevices: ["DEV-004", "DEV-005"],
      issueDate: "2023-03-20",
      expiryDate: "2024-03-20",
      lastUsed: "1 day ago",
      accessCount: 892,
      biometricLinked: false,
      securityLevel: "medium"
    },
    {
      id: "CARD-003",
      cardNumber: "3456789012345678",
      cardType: "Mifare",
      status: "expired",
      userId: "USR-003",
      userName: "Michael Chen",
      userEmail: "m.chen@student.metrouniv.edu",
      organization: "Metro University",
      department: "Computer Science",
      assignedDevices: ["DEV-004"],
      issueDate: "2022-09-01",
      expiryDate: "2023-09-01",
      lastUsed: "2 months ago",
      accessCount: 2134,
      biometricLinked: true,
      securityLevel: "medium"
    },
    {
      id: "CARD-004",
      cardNumber: "4567890123456789",
      cardType: "Proximity",
      status: "lost",
      userId: "USR-004",
      userName: "Emily Rodriguez",
      userEmail: "emily.r@innovationlab.com",
      organization: "Innovation Lab",
      department: "R&D",
      assignedDevices: ["DEV-003"],
      issueDate: "2023-06-10",
      expiryDate: "2024-06-10",
      lastUsed: "3 weeks ago",
      accessCount: 456,
      biometricLinked: false,
      securityLevel: "low"
    },
    {
      id: "CARD-005",
      cardNumber: "5678901234567890",
      cardType: "RFID",
      status: "inactive",
      userId: "USR-005",
      userName: "David Wilson",
      userEmail: "d.wilson@visitor.com",
      organization: "TechCorp HQ",
      department: "Visitor",
      assignedDevices: ["DEV-001"],
      issueDate: "2024-01-05",
      expiryDate: "2024-02-05",
      lastUsed: "1 week ago",
      accessCount: 23,
      biometricLinked: false,
      securityLevel: "low"
    }
  ];

  const filteredCards = cards.filter(card => {
    const matchesSearch = 
      card.cardNumber.includes(searchTerm) ||
      card.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || card.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case "lost":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Lost</Badge>;
      case "expired":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Expired</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSecurityLevelBadge = (level: string) => {
    const colors = {
      low: "bg-yellow-100 text-yellow-800 border-yellow-200",
      medium: "bg-blue-100 text-blue-800 border-blue-200",
      high: "bg-green-100 text-green-800 border-green-200"
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level}</Badge>;
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case "RFID":
        return "📡";
      case "NFC":
        return "📱";
      case "Mifare":
        return "🔐";
      case "Proximity":
        return "🎯";
      default:
        return "💳";
    }
  };

  const stats = {
    total: cards.length,
    active: cards.filter(c => c.status === "active").length,
    expired: cards.filter(c => c.status === "expired").length,
    lost: cards.filter(c => c.status === "lost").length,
    expiringSoon: cards.filter(c => {
      const expiryDate = new Date(c.expiryDate);
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return expiryDate <= thirtyDaysFromNow && c.status === "active";
    }).length
  };

  const isExpiryWarning = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cards Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage RFID cards, track usage, and control access permissions
          </p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Assign New Card</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Assign New Card</DialogTitle>
              <DialogDescription>
                Assign a new RFID card to a user and configure access permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-card-number">Card Number</Label>
                  <Input id="new-card-number" placeholder="1234567890123456" />
                </div>
                <div>
                  <Label htmlFor="card-type">Card Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RFID">📡 RFID</SelectItem>
                      <SelectItem value="NFC">📱 NFC</SelectItem>
                      <SelectItem value="Mifare">🔐 Mifare</SelectItem>
                      <SelectItem value="Proximity">🎯 Proximity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="assign-user">Assign to User</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usr-001">John Smith (john.smith@techcorp.com)</SelectItem>
                    <SelectItem value="usr-002">Sarah Johnson (s.johnson@metrouniv.edu)</SelectItem>
                    <SelectItem value="usr-003">Michael Chen (m.chen@student.metrouniv.edu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="security-level">Security Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="assign-devices">Assign Devices</Label>
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
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="enable-biometric" className="rounded" />
                <Label htmlFor="enable-biometric">Enable Biometric Authentication</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAssignDialogOpen(false)}>Assign Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Cards</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Active Cards</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.expired}</div>
              <p className="text-xs text-muted-foreground">Expired</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
              <p className="text-xs text-muted-foreground">Lost/Blocked</p>
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
                placeholder="Search by card number, user name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cards ({filteredCards.length})</CardTitle>
          <CardDescription>Manage card assignments and access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Info</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCardTypeIcon(card.cardType)}</div>
                      <div>
                        <div className="font-medium font-mono">{card.cardNumber}</div>
                        <div className="text-sm text-muted-foreground">{card.cardType}</div>
                        <div className="text-xs text-muted-foreground">ID: {card.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{card.userName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{card.userEmail}</div>
                      <div className="text-xs text-muted-foreground">{card.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{card.organization}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {getStatusBadge(card.status)}
                      {card.biometricLinked && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Shield className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">Biometric</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`text-sm ${isExpiryWarning(card.expiryDate) ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                        {new Date(card.expiryDate).toLocaleDateString()}
                      </div>
                      {isExpiryWarning(card.expiryDate) && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertTriangle className="h-3 w-3 text-orange-600" />
                          <span className="text-xs text-orange-600">Expiring soon</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Radio className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{card.assignedDevices.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{card.accessCount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total accesses</div>
                      <div className="text-xs text-muted-foreground">{card.lastUsed}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSecurityLevelBadge(card.securityLevel)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCard(card)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Card: {selectedCard?.cardNumber}</DialogTitle>
                            <DialogDescription>
                              Update card settings and permissions.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedCard && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-expiry">Expiry Date</Label>
                                  <Input 
                                    id="edit-expiry" 
                                    type="date" 
                                    defaultValue={selectedCard.expiryDate} 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-security">Security Level</Label>
                                  <Select defaultValue={selectedCard.securityLevel}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Assigned Devices</Label>
                                <div className="space-y-2 mt-2">
                                  {selectedCard.assignedDevices.map(deviceId => (
                                    <div key={deviceId} className="flex items-center justify-between p-2 border rounded">
                                      <span>{deviceId}</span>
                                      <Button variant="outline" size="sm">Remove</Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="edit-biometric" 
                                  defaultChecked={selectedCard.biometricLinked}
                                  className="rounded" 
                                />
                                <Label htmlFor="edit-biometric">Enable Biometric Authentication</Label>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {card.status === "active" ? (
                        <Button variant="outline" size="sm" className="text-red-600">
                          <PowerOff className="h-4 w-4" />
                        </Button>
                      ) : card.status === "lost" ? (
                        <Button variant="outline" size="sm" className="text-green-600">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-green-600">
                          <Power className="h-4 w-4" />
                        </Button>
                      )}

                      <AlertDialog open={isReportLostOpen} onOpenChange={setIsReportLostOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600"
                            onClick={() => setSelectedCard(card)}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Report Card as Lost</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will immediately deactivate the card and block all access. 
                              Are you sure you want to report card {selectedCard?.cardNumber} as lost?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Report as Lost
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
