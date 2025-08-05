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
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Bell,
  Plus,
  Search,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  Building2,
  Users,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  Zap
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "welcome" | "access_granted" | "access_denied" | "device_offline" | "card_expired" | "security_alert";
  channels: ("email" | "sms" | "whatsapp")[];
  subject: string;
  message: string;
  isActive: boolean;
  organizations: string[];
  lastUsed: string;
}

interface NotificationSettings {
  organizationId: string;
  organizationName: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailAddress: string;
  phoneNumber: string;
  whatsappNumber: string;
  notificationTypes: {
    accessAlerts: boolean;
    securityAlerts: boolean;
    deviceAlerts: boolean;
    userAlerts: boolean;
    attendanceReports: boolean;
  };
}

interface NotificationLog {
  id: string;
  timestamp: string;
  type: "email" | "sms" | "whatsapp";
  recipient: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  organization: string;
  retryCount: number;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("settings");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);

  const notificationSettings: NotificationSettings[] = [
    {
      organizationId: "ORG-001",
      organizationName: "TechCorp HQ",
      emailEnabled: true,
      smsEnabled: true,
      whatsappEnabled: false,
      emailAddress: "admin@techcorp.com",
      phoneNumber: "+1-555-123-4567",
      whatsappNumber: "+1-555-123-4567",
      notificationTypes: {
        accessAlerts: true,
        securityAlerts: true,
        deviceAlerts: true,
        userAlerts: false,
        attendanceReports: true
      }
    },
    {
      organizationId: "ORG-002",
      organizationName: "Metro University",
      emailEnabled: true,
      smsEnabled: false,
      whatsappEnabled: true,
      emailAddress: "admin@metrouniv.edu",
      phoneNumber: "+1-555-987-6543",
      whatsappNumber: "+1-555-987-6543",
      notificationTypes: {
        accessAlerts: false,
        securityAlerts: true,
        deviceAlerts: true,
        userAlerts: true,
        attendanceReports: false
      }
    },
    {
      organizationId: "ORG-003",
      organizationName: "Innovation Lab",
      emailEnabled: true,
      smsEnabled: true,
      whatsappEnabled: true,
      emailAddress: "contact@innovationlab.com",
      phoneNumber: "+1-555-456-7890",
      whatsappNumber: "+1-555-456-7890",
      notificationTypes: {
        accessAlerts: true,
        securityAlerts: true,
        deviceAlerts: false,
        userAlerts: true,
        attendanceReports: true
      }
    }
  ];

  const notificationTemplates: NotificationTemplate[] = [
    {
      id: "TPL-001",
      name: "Welcome New User",
      type: "welcome",
      channels: ["email", "sms"],
      subject: "Welcome to {organization_name} RFID System",
      message: "Hello {user_name}, your RFID access has been activated. Card number: {card_number}",
      isActive: true,
      organizations: ["ORG-001", "ORG-002"],
      lastUsed: "2 hours ago"
    },
    {
      id: "TPL-002",
      name: "Access Denied Alert",
      type: "access_denied",
      channels: ["email", "whatsapp"],
      subject: "Security Alert: Unauthorized Access Attempt",
      message: "Unauthorized access attempt detected at {device_name} by card {card_number} at {timestamp}",
      isActive: true,
      organizations: ["ORG-001", "ORG-003"],
      lastUsed: "1 day ago"
    },
    {
      id: "TPL-003",
      name: "Device Offline Alert",
      type: "device_offline",
      channels: ["email", "sms", "whatsapp"],
      subject: "Device Offline: {device_name}",
      message: "Device {device_name} at {location} has gone offline. Please check device connectivity.",
      isActive: true,
      organizations: ["ORG-001", "ORG-002", "ORG-003"],
      lastUsed: "3 hours ago"
    },
    {
      id: "TPL-004",
      name: "Card Expiry Warning",
      type: "card_expired",
      channels: ["email"],
      subject: "Card Expiry Notice",
      message: "Your RFID card {card_number} will expire on {expiry_date}. Please contact admin for renewal.",
      isActive: false,
      organizations: ["ORG-002"],
      lastUsed: "1 week ago"
    }
  ];

  const notificationLogs: NotificationLog[] = [
    {
      id: "LOG-001",
      timestamp: "2024-01-15 14:30:25",
      type: "email",
      recipient: "admin@techcorp.com",
      subject: "Device Offline: Main Entrance Scanner",
      status: "sent",
      organization: "TechCorp HQ",
      retryCount: 0
    },
    {
      id: "LOG-002",
      timestamp: "2024-01-15 14:25:12",
      type: "sms",
      recipient: "+1-555-123-4567",
      subject: "Security Alert: Unauthorized Access",
      status: "sent",
      organization: "TechCorp HQ",
      retryCount: 0
    },
    {
      id: "LOG-003",
      timestamp: "2024-01-15 14:20:03",
      type: "whatsapp",
      recipient: "+1-555-987-6543",
      subject: "Welcome New User",
      status: "failed",
      organization: "Metro University",
      retryCount: 2
    },
    {
      id: "LOG-004",
      timestamp: "2024-01-15 14:15:47",
      type: "email",
      recipient: "contact@innovationlab.com",
      subject: "Device Offline Alert",
      status: "pending",
      organization: "Innovation Lab",
      retryCount: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sent
        </Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Phone className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "sms":
        return <Phone className="h-4 w-4 text-green-600" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const stats = {
    totalSent: notificationLogs.filter(log => log.status === "sent").length,
    totalFailed: notificationLogs.filter(log => log.status === "failed").length,
    totalPending: notificationLogs.filter(log => log.status === "pending").length,
    activeTemplates: notificationTemplates.filter(t => t.isActive).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notification Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure SMS, email, and WhatsApp notifications for organizations and users
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Test className="h-4 w-4" />
            <span>Test Notification</span>
          </Button>
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Notification Template</DialogTitle>
                <DialogDescription>
                  Create a new notification template for automated messages.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="Enter template name" />
                  </div>
                  <div>
                    <Label htmlFor="template-type">Notification Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Message</SelectItem>
                        <SelectItem value="access_granted">Access Granted</SelectItem>
                        <SelectItem value="access_denied">Access Denied</SelectItem>
                        <SelectItem value="device_offline">Device Offline</SelectItem>
                        <SelectItem value="card_expired">Card Expired</SelectItem>
                        <SelectItem value="security_alert">Security Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notification Channels</Label>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-channel" className="rounded" />
                      <Label htmlFor="email-channel" className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms-channel" className="rounded" />
                      <Label htmlFor="sms-channel" className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>SMS</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="whatsapp-channel" className="rounded" />
                      <Label htmlFor="whatsapp-channel" className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="template-subject">Subject/Title</Label>
                  <Input id="template-subject" placeholder="Enter subject line" />
                </div>
                <div>
                  <Label htmlFor="template-message">Message Template</Label>
                  <Textarea 
                    id="template-message" 
                    placeholder="Enter message template with variables like {user_name}, {organization_name}, {device_name}"
                    className="min-h-20"
                  />
                </div>
                <div>
                  <Label htmlFor="template-orgs">Assign to Organizations</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organizations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org-001">TechCorp HQ</SelectItem>
                      <SelectItem value="org-002">Metro University</SelectItem>
                      <SelectItem value="org-003">Innovation Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsTemplateDialogOpen(false)}>Create Template</Button>
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
              <div className="text-2xl font-bold text-green-600">{stats.totalSent}</div>
              <p className="text-xs text-muted-foreground">Sent Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.totalFailed}</div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.totalPending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.activeTemplates}</div>
              <p className="text-xs text-muted-foreground">Active Templates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Organization Settings</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          {/* Organization Notification Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notificationSettings.map((org) => (
              <Card key={org.organizationId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{org.organizationName}</CardTitle>
                      <CardDescription>ID: {org.organizationId}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Email Notifications</span>
                      </div>
                      <Switch checked={org.emailEnabled} />
                    </div>
                    {org.emailEnabled && (
                      <div className="ml-6">
                        <Input 
                          value={org.emailAddress} 
                          placeholder="Email address"
                          className="text-sm"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">SMS Notifications</span>
                      </div>
                      <Switch checked={org.smsEnabled} />
                    </div>
                    {org.smsEnabled && (
                      <div className="ml-6">
                        <Input 
                          value={org.phoneNumber} 
                          placeholder="Phone number"
                          className="text-sm"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">WhatsApp Notifications</span>
                      </div>
                      <Switch checked={org.whatsappEnabled} />
                    </div>
                    {org.whatsappEnabled && (
                      <div className="ml-6">
                        <Input 
                          value={org.whatsappNumber} 
                          placeholder="WhatsApp number"
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Alert Types</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Access Alerts</span>
                        <Switch checked={org.notificationTypes.accessAlerts} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Security Alerts</span>
                        <Switch checked={org.notificationTypes.securityAlerts} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Device Alerts</span>
                        <Switch checked={org.notificationTypes.deviceAlerts} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Alerts</span>
                        <Switch checked={org.notificationTypes.userAlerts} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Attendance Reports</span>
                        <Switch checked={org.notificationTypes.attendanceReports} />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Manage automated message templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Organizations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">{template.subject}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {template.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {template.channels.map(channel => (
                            <div key={channel} className="p-1 rounded bg-muted">
                              {getChannelIcon(channel)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{template.organizations.length} orgs</span>
                      </TableCell>
                      <TableCell>
                        {template.isActive ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {template.lastUsed}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTemplate(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
                                <DialogDescription>
                                  Update notification template settings and content.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTemplate && (
                                <div className="grid gap-4 py-4">
                                  <div>
                                    <Label htmlFor="edit-subject">Subject</Label>
                                    <Input 
                                      id="edit-subject" 
                                      defaultValue={selectedTemplate.subject} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-message">Message</Label>
                                    <Textarea 
                                      id="edit-message" 
                                      defaultValue={selectedTemplate.message}
                                      className="min-h-20"
                                    />
                                  </div>
                                  <div>
                                    <Label>Channels</Label>
                                    <div className="flex space-x-4 mt-2">
                                      {["email", "sms", "whatsapp"].map(channel => (
                                        <div key={channel} className="flex items-center space-x-2">
                                          <input 
                                            type="checkbox" 
                                            id={`edit-${channel}`}
                                            defaultChecked={selectedTemplate.channels.includes(channel as any)}
                                            className="rounded" 
                                          />
                                          <Label htmlFor={`edit-${channel}`} className="flex items-center space-x-1">
                                            {getChannelIcon(channel)}
                                            <span className="capitalize">{channel}</span>
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      id="edit-active" 
                                      defaultChecked={selectedTemplate.isActive}
                                      className="rounded" 
                                    />
                                    <Label htmlFor="edit-active">Template Active</Label>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsEditTemplateOpen(false)}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Notification Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Logs</CardTitle>
              <CardDescription>View recent notification delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search logs by recipient, organization, or subject..."
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
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Retries</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-mono">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(log.type)}
                          <span className="capitalize">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.recipient}
                      </TableCell>
                      <TableCell className="max-w-60 truncate">
                        {log.subject}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.organization}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell>
                        {log.retryCount > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            {log.retryCount} retries
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          {/* Global Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Global email settings for all notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input id="smtp-server" defaultValue="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-encryption">Encryption</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" defaultValue="admin@rfidsystem.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS & WhatsApp Configuration</CardTitle>
                <CardDescription>Configure SMS and WhatsApp API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sms-api-key">API Key</Label>
                  <Input id="sms-api-key" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="sms-api-secret">API Secret</Label>
                  <Input id="sms-api-secret" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="whatsapp-token">WhatsApp Business API Token</Label>
                  <Input id="whatsapp-token" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
                  <Input id="whatsapp-number" placeholder="+1-555-000-0000" />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save SMS/WhatsApp Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
