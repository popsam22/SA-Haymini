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
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Clock,
  Calendar as CalendarIcon,
  Download,
  Search,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Filter,
  RefreshCw,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Eye,
  Edit
} from "lucide-react";
import { format, isValid } from "date-fns";

interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  employeeId: string;
  organization: string;
  organizationId: string;
  department: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  totalHours: number | null;
  status: "present" | "absent" | "partial" | "late";
  deviceUsed: string;
  cardNumber: string;
  notes?: string;
}

interface Organization {
  id: string;
  name: string;
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageHours: number;
  monthlyTrend: "up" | "down" | "stable";
}

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("organizations");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const organizations: Organization[] = [
    {
      id: "ORG-001",
      name: "TechCorp HQ",
      totalEmployees: 345,
      presentToday: 298,
      absentToday: 32,
      lateToday: 15,
      averageHours: 8.2,
      monthlyTrend: "up"
    },
    {
      id: "ORG-002",
      name: "Metro University",
      totalEmployees: 1847,
      presentToday: 1634,
      absentToday: 156,
      lateToday: 57,
      averageHours: 7.8,
      monthlyTrend: "stable"
    },
    {
      id: "ORG-003",
      name: "Innovation Lab",
      totalEmployees: 89,
      presentToday: 76,
      absentToday: 8,
      lateToday: 5,
      averageHours: 8.5,
      monthlyTrend: "down"
    }
  ];

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "ATT-001",
      userId: "USR-001",
      userName: "John Smith",
      userEmail: "john.smith@techcorp.com",
      employeeId: "TC001",
      organization: "TechCorp HQ",
      organizationId: "ORG-001",
      department: "Engineering",
      date: "2024-01-15",
      punchIn: "08:30:00",
      punchOut: "17:45:00",
      totalHours: 9.25,
      status: "present",
      deviceUsed: "DEV-001",
      cardNumber: "CARD-001234"
    },
    {
      id: "ATT-002",
      userId: "USR-002",
      userName: "Sarah Johnson",
      userEmail: "s.johnson@metrouniv.edu",
      employeeId: "MU002",
      organization: "Metro University",
      organizationId: "ORG-002",
      department: "Library",
      date: "2024-01-15",
      punchIn: "09:15:00",
      punchOut: "16:30:00",
      totalHours: 7.25,
      status: "late",
      deviceUsed: "DEV-004",
      cardNumber: "CARD-005678"
    },
    {
      id: "ATT-003",
      userId: "USR-003",
      userName: "Michael Chen",
      userEmail: "m.chen@student.metrouniv.edu",
      employeeId: "ST003",
      organization: "Metro University",
      organizationId: "ORG-002",
      department: "Computer Science",
      date: "2024-01-15",
      punchIn: "10:00:00",
      punchOut: null,
      totalHours: null,
      status: "partial",
      deviceUsed: "DEV-004",
      cardNumber: "CARD-009012",
      notes: "Forgot to punch out"
    },
    {
      id: "ATT-004",
      userId: "USR-004",
      userName: "Emily Rodriguez",
      userEmail: "emily.r@innovationlab.com",
      employeeId: "IL004",
      organization: "Innovation Lab",
      organizationId: "ORG-003",
      department: "R&D",
      date: "2024-01-15",
      punchIn: null,
      punchOut: null,
      totalHours: null,
      status: "absent",
      deviceUsed: "",
      cardNumber: "CARD-003456"
    },
    {
      id: "ATT-005",
      userId: "USR-005",
      userName: "David Wilson",
      userEmail: "d.wilson@visitor.com",
      employeeId: "VIS005",
      organization: "TechCorp HQ",
      organizationId: "ORG-001",
      department: "Visitor",
      date: "2024-01-15",
      punchIn: "14:30:00",
      punchOut: "18:00:00",
      totalHours: 3.5,
      status: "present",
      deviceUsed: "DEV-001",
      cardNumber: "CARD-007890"
    },
    {
      id: "ATT-006",
      userId: "USR-006",
      userName: "Lisa Wang",
      userEmail: "l.wang@techcorp.com",
      employeeId: "TC002",
      organization: "TechCorp HQ",
      organizationId: "ORG-001",
      department: "HR",
      date: "2024-01-15",
      punchIn: "08:45:00",
      punchOut: "17:30:00",
      totalHours: 8.75,
      status: "present",
      deviceUsed: "DEV-001",
      cardNumber: "CARD-001235"
    }
  ];

  const getRecordsByOrganization = (orgId: string) => {
    return attendanceRecords.filter(record => record.organizationId === orgId);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = 
      record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrg = selectedOrganization === "all" || record.organizationId === selectedOrganization;
    
    return matchesSearch && matchesOrg;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Present
        </Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Absent
        </Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Late
        </Badge>;
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Timer className="h-3 w-3 mr-1" />
          Partial
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const calculateAttendanceRate = (present: number, total: number) => {
    return Math.round((present / total) * 100);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatHours = (hours: number | null) => {
    if (hours === null) return "N/A";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const totalStats = {
    totalEmployees: organizations.reduce((sum, org) => sum + org.totalEmployees, 0),
    totalPresent: organizations.reduce((sum, org) => sum + org.presentToday, 0),
    totalAbsent: organizations.reduce((sum, org) => sum + org.absentToday, 0),
    totalLate: organizations.reduce((sum, org) => sum + org.lateToday, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track attendance across organizations with punch in/out records and date filtering
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate Attendance Report</DialogTitle>
                <DialogDescription>
                  Create attendance reports for organizations or individuals.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="report-org">Organization</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Organizations</SelectItem>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="report-format">Report Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateRange.from, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => date && setDateRange({...dateRange, from: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateRange.to, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => date && setDateRange({...dateRange, to: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsReportDialogOpen(false)}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Total Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalStats.totalPresent}</div>
              <p className="text-xs text-muted-foreground">Present Today</p>
              <p className="text-xs text-green-600">{calculateAttendanceRate(totalStats.totalPresent, totalStats.totalEmployees)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalStats.totalAbsent}</div>
              <p className="text-xs text-muted-foreground">Absent Today</p>
              <p className="text-xs text-red-600">{calculateAttendanceRate(totalStats.totalAbsent, totalStats.totalEmployees)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalStats.totalLate}</div>
              <p className="text-xs text-muted-foreground">Late Today</p>
              <p className="text-xs text-yellow-600">{calculateAttendanceRate(totalStats.totalLate, totalStats.totalEmployees)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organizations">By Organization</TabsTrigger>
          <TabsTrigger value="daily">Daily Records</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-6">
          {/* Organization-based attendance view */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {isValid(selectedDate) ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search users by name or employee ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Accordion type="multiple" className="w-full space-y-4">
              {organizations.map((org) => {
                const orgRecords = getRecordsByOrganization(org.id).filter(record => {
                  const matchesSearch = 
                    record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
                  return matchesSearch;
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
                                {org.presentToday}/{org.totalEmployees} present today
                              </p>
                            </div>
                            {getTrendIcon(org.monthlyTrend)}
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{org.presentToday}</div>
                              <div className="text-muted-foreground">Present</div>
                              <div className="text-xs text-green-600">
                                {calculateAttendanceRate(org.presentToday, org.totalEmployees)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{org.absentToday}</div>
                              <div className="text-muted-foreground">Absent</div>
                              <div className="text-xs text-red-600">
                                {calculateAttendanceRate(org.absentToday, org.totalEmployees)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">{org.lateToday}</div>
                              <div className="text-muted-foreground">Late</div>
                              <div className="text-xs text-yellow-600">
                                {calculateAttendanceRate(org.lateToday, org.totalEmployees)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{org.averageHours}h</div>
                              <div className="text-muted-foreground">Avg Hours</div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Punch In</TableHead>
                              <TableHead>Punch Out</TableHead>
                              <TableHead>Total Hours</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Device</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orgRecords.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium flex items-center space-x-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span>{record.userName}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">{record.userEmail}</div>
                                    <div className="text-xs text-muted-foreground">ID: {record.employeeId}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{record.department}</TableCell>
                                <TableCell>
                                  <div className="font-mono text-sm">
                                    {formatTime(record.punchIn)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-mono text-sm">
                                    {formatTime(record.punchOut)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {formatHours(record.totalHours)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(record.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {record.deviceUsed || "N/A"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setSelectedRecord(record)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Attendance Record</DialogTitle>
                                          <DialogDescription>
                                            Manually adjust attendance record for {selectedRecord?.userName}
                                          </DialogDescription>
                                        </DialogHeader>
                                        {selectedRecord && (
                                          <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label htmlFor="edit-punch-in">Punch In Time</Label>
                                                <Input 
                                                  id="edit-punch-in" 
                                                  type="time" 
                                                  defaultValue={selectedRecord.punchIn || ""} 
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-punch-out">Punch Out Time</Label>
                                                <Input 
                                                  id="edit-punch-out" 
                                                  type="time" 
                                                  defaultValue={selectedRecord.punchOut || ""} 
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <Label htmlFor="edit-status">Status</Label>
                                              <Select defaultValue={selectedRecord.status}>
                                                <SelectTrigger>
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="present">Present</SelectItem>
                                                  <SelectItem value="absent">Absent</SelectItem>
                                                  <SelectItem value="late">Late</SelectItem>
                                                  <SelectItem value="partial">Partial</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="edit-notes">Notes</Label>
                                              <Input 
                                                id="edit-notes" 
                                                placeholder="Add notes about this attendance record"
                                                defaultValue={selectedRecord.notes || ""}
                                              />
                                            </div>
                                          </div>
                                        )}
                                        <DialogFooter>
                                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                          <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
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
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          {/* Daily Records Tab */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div>
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {isValid(selectedDate) ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, employee ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Records ({filteredRecords.length})</CardTitle>
              <CardDescription>Complete attendance records for {isValid(selectedDate) ? format(selectedDate, "PPP") : "selected date"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Punch In</TableHead>
                    <TableHead>Punch Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{record.userName}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{record.userEmail}</div>
                          <div className="text-xs text-muted-foreground">ID: {record.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{record.organization}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {formatTime(record.punchIn)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {formatTime(record.punchOut)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatHours(record.totalHours)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.deviceUsed || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-32 truncate">
                          {record.notes || "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate comprehensive attendance reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Advanced reporting and analytics features</p>
                <p className="text-sm text-muted-foreground mt-2">Including attendance trends, productivity metrics, and custom reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
