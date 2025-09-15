import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from 'xlsx';
import { 
  useLogs, 
  useLogsByOrganization, 
  useOrganizations, 
  useUsers, 
  useDevices,
  useUserLogs 
} from "../hooks/useApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
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
  Clock,
  Calendar as CalendarIcon,
  Download,
  Search,
  Building2,
  Users,
  Radio,
  BarChart3,
  FileText,
  Filter,
  RefreshCw,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Loader2,
  Mail,
  Phone
} from "lucide-react";
import { format, isValid } from "date-fns";
import { useToast } from "../hooks/use-toast";

interface AttendanceLog {
  timesheetid: number;
  punchingcode: string;
  date: string;
  time: string;
  Tid: string;
  user_id: number;
  organization_id: number;
  name: string;
  organization_name: string;
}

interface Organization {
  id: number;
  name: string;
  address?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
}

interface User {
  id: number;
  name: string;
  punchingcode: string;
  organization_id: number;
  organization_name?: string;
}

interface Device {
  serial_number: string;
  device_name?: string;
  device_model?: string;
  organization_id: number;
  organization_name?: string;
}

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("all-logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { toast } = useToast();

  // API queries
  const {
    data: allLogsResponse = [],
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useLogs({
    start_date: format(startDate, 'yyyy-MM-dd'),
    end_date: format(endDate, 'yyyy-MM-dd'),
  });

  const { data: organizationsResponse = [], isLoading: orgsLoading } = useOrganizations();
  const { data: usersResponse = [], isLoading: usersLoading } = useUsers();
  const { data: devicesResponse = [], isLoading: devicesLoading } = useDevices();

  // Data parsing with proper typing
  const logs: AttendanceLog[] = Array.isArray(allLogsResponse)
    ? allLogsResponse as AttendanceLog[]
    : (allLogsResponse as any)?.logs && Array.isArray((allLogsResponse as any).logs)
      ? (allLogsResponse as any).logs as AttendanceLog[]
      : [];

  const organizations: Organization[] = Array.isArray(organizationsResponse)
    ? organizationsResponse as Organization[]
    : (organizationsResponse as any)?.organizations && Array.isArray((organizationsResponse as any).organizations)
      ? (organizationsResponse as any).organizations as Organization[]
      : [];

  const users: User[] = Array.isArray(usersResponse)
    ? usersResponse as User[]
    : (usersResponse as any)?.users && Array.isArray((usersResponse as any).users)
      ? (usersResponse as any).users as User[]
      : [];

  const devices: Device[] = Array.isArray(devicesResponse)
    ? devicesResponse as Device[]
    : (devicesResponse as any)?.devices && Array.isArray((devicesResponse as any).devices)
      ? (devicesResponse as any).devices as Device[]
      : [];

  // Filtered logs
  const filteredLogs: AttendanceLog[] = logs.filter((log) => {
    const matchesSearch = 
      log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.punchingcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.Tid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrg = !selectedOrganization || 
      selectedOrganization === "all" || 
      log.organization_id?.toString() === selectedOrganization;
    
    const matchesDevice = !selectedDevice || 
      selectedDevice === "all" || 
      log.Tid === selectedDevice;
    
    const matchesUser = !selectedUser || 
      selectedUser === "all" || 
      log.punchingcode === selectedUser;

    return matchesSearch && matchesOrg && matchesDevice && matchesUser;
  });

  const getLogTypeBadge = (time: string) => {
    // Since we don't have explicit log type, we'll show a generic attendance badge
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
      <Clock className="h-3 w-3 mr-1" />
      Attendance
    </Badge>;
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return {
        date: dateObj.toLocaleDateString(),
        time: dateObj.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
    } catch {
      return { date: date || 'N/A', time: time || 'N/A' };
    }
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes));
      return timeObj.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return time;
    }
  };

  const exportToExcel = (exportData: AttendanceLog[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(exportData.map(log => ({
      'Timesheet ID': log.timesheetid,
      'User Name': log.name,
      'Punching Code': log.punchingcode,
      'Organization': log.organization_name,
      'Device TID': log.Tid,
      'Date': log.date,
      'Time': formatTime(log.time),
      'User ID': log.user_id,
      'Organization ID': log.organization_id,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Logs");

    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: `${exportData.length} records exported to ${filename}.xlsx`,
    });
  };

  const handleExportAll = () => {
    exportToExcel(filteredLogs, `attendance-logs-${format(new Date(), 'yyyy-MM-dd')}`);
    setIsExportDialogOpen(false);
  };

  const handleExportByOrganization = () => {
    if (!selectedOrganization || selectedOrganization === "all") {
      toast({
        title: "Error",
        description: "Please select a specific organization to export.",
        variant: "destructive",
      });
      return;
    }
    
    const orgName = organizations.find((org) => org.id.toString() === selectedOrganization)?.name || 'unknown';
    exportToExcel(filteredLogs, `attendance-${orgName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}`);
    setIsExportDialogOpen(false);
  };

  const handleExportByDevice = () => {
    if (!selectedDevice || selectedDevice === "all") {
      toast({
        title: "Error",
        description: "Please select a specific device to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportToExcel(filteredLogs, `attendance-device-${selectedDevice.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}`);
    setIsExportDialogOpen(false);
  };

  const handleExportByUser = () => {
    if (!selectedUser || selectedUser === "all") {
      toast({
        title: "Error",
        description: "Please select a specific user to export.",
        variant: "destructive",
      });
      return;
    }
    
    const userName = logs.find((log) => log.punchingcode === selectedUser)?.name || 'unknown';
    exportToExcel(filteredLogs, `attendance-${userName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}`);
    setIsExportDialogOpen(false);
  };

  if (logsLoading || orgsLoading || usersLoading || devicesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage attendance logs across all organizations
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading attendance data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (logsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage attendance logs across all organizations
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load attendance logs: {(logsError as any).message}
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => refetchLogs()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage attendance logs across all organizations
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => refetchLogs()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Export Attendance Logs</DialogTitle>
                <DialogDescription>
                  Export attendance data to Excel format
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Button onClick={handleExportAll} className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Export All Filtered Logs ({filteredLogs.length} records)
                </Button>
                <Button onClick={handleExportByOrganization} variant="outline" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Export by Selected Organization
                </Button>
                <Button onClick={handleExportByDevice} variant="outline" className="w-full justify-start">
                  <Radio className="h-4 w-4 mr-2" />
                  Export by Selected Device
                </Button>
                <Button onClick={handleExportByUser} variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Export by Selected User
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{logs.length}</div>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(logs.map((log) => log.punchingcode)).size}
              </div>
              <p className="text-xs text-muted-foreground">Unique Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {new Set(logs.map((log) => log.organization_id)).size}
              </div>
              <p className="text-xs text-muted-foreground">Organizations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredLogs.length}</div>
              <p className="text-xs text-muted-foreground">Filtered Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger>
                <SelectValue placeholder="All Devices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                {Array.from(new Set(logs.map((log) => log.Tid))).map((tid) => (
                  <SelectItem key={tid} value={tid}>
                    {tid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {Array.from(new Map(logs.map((log) => [
                  log.punchingcode,
                  { punchingcode: log.punchingcode, name: log.name }
                ])).values()).map((user) => (
                  <SelectItem key={user.punchingcode} value={user.punchingcode}>
                    {user.name} ({user.punchingcode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  From: {format(startDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(date);
                      refetchLogs();
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  To: {format(endDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    if (date) {
                      setEndDate(date);
                      refetchLogs();
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Attendance Logs ({filteredLogs.length})</span>
          </CardTitle>
          <CardDescription>
            Real-time attendance tracking across all connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Device TID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Timesheet ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, index) => {
                  return (
                    <TableRow key={log.timesheetid || index}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{log.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Code: {log.punchingcode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.organization_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Radio className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{log.Tid}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.date}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {formatTime(log.time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">#{log.timesheetid}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Attendance Logs Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedOrganization || selectedDevice || selectedUser
                  ? "No logs match your current filters."
                  : "No attendance logs available for the selected date range."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}