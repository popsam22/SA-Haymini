import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
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
import { Separator } from "../components/ui/separator";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Database,
  Shield,
  Users,
  Clock,
  Server,
  Key,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  Palette,
  Bell,
  Monitor,
  HardDrive,
  Wifi,
  Activity
} from "lucide-react";

interface SystemUser {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "admin" | "operator" | "viewer";
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  time: string;
  isActive: boolean;
  lastBackup: string;
  nextBackup: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  const systemUsers: SystemUser[] = [
    {
      id: "SU-001",
      username: "admin",
      email: "admin@rfidsystem.com",
      role: "super_admin",
      isActive: true,
      lastLogin: "2024-01-15 14:30:25",
      createdAt: "2023-01-01"
    },
    {
      id: "SU-002",
      username: "john.manager",
      email: "john.manager@techcorp.com",
      role: "admin",
      isActive: true,
      lastLogin: "2024-01-15 10:15:00",
      createdAt: "2023-03-15"
    },
    {
      id: "SU-003",
      username: "sarah.operator",
      email: "sarah.operator@metrouniv.edu",
      role: "operator",
      isActive: true,
      lastLogin: "2024-01-14 16:45:00",
      createdAt: "2023-06-20"
    },
    {
      id: "SU-004",
      username: "mike.viewer",
      email: "mike.viewer@innovationlab.com",
      role: "viewer",
      isActive: false,
      lastLogin: "2024-01-10 09:30:00",
      createdAt: "2023-08-10"
    }
  ];

  const backupSchedules: BackupSchedule[] = [
    {
      id: "BK-001",
      name: "Daily System Backup",
      frequency: "daily",
      time: "02:00",
      isActive: true,
      lastBackup: "2024-01-15 02:00:00",
      nextBackup: "2024-01-16 02:00:00"
    },
    {
      id: "BK-002",
      name: "Weekly Full Backup",
      frequency: "weekly",
      time: "01:00",
      isActive: true,
      lastBackup: "2024-01-14 01:00:00",
      nextBackup: "2024-01-21 01:00:00"
    },
    {
      id: "BK-003",
      name: "Monthly Archive",
      frequency: "monthly",
      time: "00:00",
      isActive: false,
      lastBackup: "2024-01-01 00:00:00",
      nextBackup: "2024-02-01 00:00:00"
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "AL-001",
      timestamp: "2024-01-15 14:30:25",
      user: "admin",
      action: "CREATE",
      resource: "USER",
      details: "Created new user: john.manager",
      ipAddress: "192.168.1.100"
    },
    {
      id: "AL-002",
      timestamp: "2024-01-15 14:25:12",
      user: "john.manager",
      action: "UPDATE",
      resource: "DEVICE",
      details: "Updated device DEV-001 configuration",
      ipAddress: "192.168.1.101"
    },
    {
      id: "AL-003",
      timestamp: "2024-01-15 14:20:03",
      user: "sarah.operator",
      action: "DELETE",
      resource: "CARD",
      details: "Deactivated card CARD-003456",
      ipAddress: "192.168.1.102"
    }
  ];

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: "bg-red-100 text-red-800 border-red-200",
      admin: "bg-blue-100 text-blue-800 border-blue-200",
      operator: "bg-green-100 text-green-800 border-green-200",
      viewer: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return <Badge className={colors[role as keyof typeof colors]}>
      {role.replace('_', ' ').toUpperCase()}
    </Badge>;
  };

  const getActionBadge = (action: string) => {
    const colors = {
      CREATE: "bg-green-100 text-green-800 border-green-200",
      UPDATE: "bg-blue-100 text-blue-800 border-blue-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
      VIEW: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return <Badge className={colors[action as keyof typeof colors]}>{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure system-wide settings and administrative controls
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Settings</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Reload Config</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
          <TabsTrigger value="integrations">3rd Party APIs</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp API</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>Basic system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="RFID Management System" />
                </div>
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="RFID Solutions Inc." />
                </div>
                <div>
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="UTC-5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Block all non-admin access</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance & Branding</CardTitle>
                <CardDescription>Customize the look and feel of your system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Default Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="primary-color" defaultValue="#3b82f6" type="color" className="w-16 h-10" />
                    <Input defaultValue="#3b82f6" className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="logo-upload">System Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload logo image</p>
                    <Input type="file" accept="image/*" className="mt-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-branding">Show Company Branding</Label>
                    <p className="text-sm text-muted-foreground">Display company logo and name</p>
                  </div>
                  <Switch id="show-branding" defaultChecked />
                </div>
                <Button className="w-full">
                  <Palette className="h-4 w-4 mr-2" />
                  Save Appearance
                </Button>
              </CardContent>
            </Card>

            {/* Email & Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Default Notification Settings</CardTitle>
                <CardDescription>System-wide notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email alerts and reports</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send SMS alerts for critical events</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" defaultValue="admin@rfidsystem.com" type="email" />
                </div>
                <Button className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>

            {/* System Limits */}
            <Card>
              <CardHeader>
                <CardTitle>System Limits & Quotas</CardTitle>
                <CardDescription>Configure system operational limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="max-organizations">Max Organizations</Label>
                  <Input id="max-organizations" type="number" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="max-devices">Max Devices per Organization</Label>
                  <Input id="max-devices" type="number" defaultValue="50" />
                </div>
                <div>
                  <Label htmlFor="max-users">Max Users per Organization</Label>
                  <Input id="max-users" type="number" defaultValue="10000" />
                </div>
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="120" />
                </div>
                <div>
                  <Label htmlFor="log-retention">Log Retention (days)</Label>
                  <Input id="log-retention" type="number" defaultValue="90" />
                </div>
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Save System Limits
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
                <CardDescription>Configure authentication and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enforce 2FA for all admin users</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-complexity">Strong Password Policy</Label>
                    <p className="text-sm text-muted-foreground">Enforce complex password requirements</p>
                  </div>
                  <Switch id="password-complexity" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="min-password-length">Minimum Password Length</Label>
                  <Input id="min-password-length" type="number" defaultValue="8" />
                </div>
                <div>
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input id="password-expiry" type="number" defaultValue="90" />
                </div>
                <div>
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input id="max-login-attempts" type="number" defaultValue="5" />
                </div>
                <div>
                  <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                  <Input id="lockout-duration" type="number" defaultValue="30" />
                </div>
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>

            {/* API Security */}
            <Card>
              <CardHeader>
                <CardTitle>API Security</CardTitle>
                <CardDescription>Configure API access and rate limiting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-enabled">Enable API Access</Label>
                    <p className="text-sm text-muted-foreground">Allow external API connections</p>
                  </div>
                  <Switch id="api-enabled" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="api-rate-limit">Rate Limit (requests/minute)</Label>
                  <Input id="api-rate-limit" type="number" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="api-key-expiry">API Key Expiry (days)</Label>
                  <Input id="api-key-expiry" type="number" defaultValue="365" />
                </div>
                <div>
                  <Label htmlFor="allowed-origins">Allowed Origins (CORS)</Label>
                  <Textarea 
                    id="allowed-origins" 
                    placeholder="https://example.com&#10;https://app.example.com"
                    className="min-h-20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-logging">Log API Requests</Label>
                    <p className="text-sm text-muted-foreground">Track all API usage</p>
                  </div>
                  <Switch id="api-logging" defaultChecked />
                </div>
                <Button className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Save API Settings
                </Button>
              </CardContent>
            </Card>

            {/* Encryption Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Encryption & Certificates</CardTitle>
                <CardDescription>Manage data encryption and SSL certificates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-encryption">Encrypt Sensitive Data</Label>
                    <p className="text-sm text-muted-foreground">Encrypt card numbers and personal info</p>
                  </div>
                  <Switch id="data-encryption" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
                  <Select defaultValue="AES-256">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES-256">AES-256</SelectItem>
                      <SelectItem value="AES-128">AES-128</SelectItem>
                      <SelectItem value="ChaCha20">ChaCha20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>SSL Certificate</Label>
                  <div className="p-3 border rounded bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">rfidsystem.com</p>
                        <p className="text-xs text-muted-foreground">Expires: 2024-12-31</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Valid</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Certificate
                </Button>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Encryption Settings
                </Button>
              </CardContent>
            </Card>

            {/* Security Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Security Monitoring</CardTitle>
                <CardDescription>Configure security alerts and monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="intrusion-detection">Intrusion Detection</Label>
                    <p className="text-sm text-muted-foreground">Monitor for suspicious activity</p>
                  </div>
                  <Switch id="intrusion-detection" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="failed-login-alerts">Failed Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert on repeated failed logins</p>
                  </div>
                  <Switch id="failed-login-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ip-whitelist">IP Address Restrictions</Label>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                  </div>
                  <Switch id="ip-whitelist" />
                </div>
                <div>
                  <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                  <Textarea 
                    id="allowed-ips" 
                    placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                    className="min-h-20"
                  />
                </div>
                <Button className="w-full">
                  <Monitor className="h-4 w-4 mr-2" />
                  Save Monitoring Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>Manage administrative user accounts</CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add System User</DialogTitle>
                      <DialogDescription>
                        Create a new administrative user account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-username">Username</Label>
                          <Input id="new-username" placeholder="username" />
                        </div>
                        <div>
                          <Label htmlFor="new-email">Email</Label>
                          <Input id="new-email" type="email" placeholder="user@example.com" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-password">Password</Label>
                          <Input id="new-password" type="password" placeholder="••••••••" />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input id="confirm-password" type="password" placeholder="••••••••" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsUserDialogOpen(false)}>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-mono">{user.lastLogin}</TableCell>
                      <TableCell className="text-sm">{user.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.role !== "super_admin" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          {/* Backup Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Backup Schedules</CardTitle>
                    <CardDescription>Automated backup configuration</CardDescription>
                  </div>
                  <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Backup Schedule</DialogTitle>
                        <DialogDescription>
                          Set up automated backup schedule.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="backup-name">Schedule Name</Label>
                          <Input id="backup-name" placeholder="Daily backup" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="backup-frequency">Frequency</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="backup-time">Time</Label>
                            <Input id="backup-time" type="time" defaultValue="02:00" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsBackupDialogOpen(false)}>Create Schedule</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{schedule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.frequency} at {schedule.time}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Next: {schedule.nextBackup}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {schedule.isActive ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manual Backup</CardTitle>
                <CardDescription>Create immediate backup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backup-type">Backup Type</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full System Backup</SelectItem>
                      <SelectItem value="database">Database Only</SelectItem>
                      <SelectItem value="config">Configuration Only</SelectItem>
                      <SelectItem value="files">Files Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backup-location">Backup Location</Label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="ftp">FTP Server</SelectItem>
                      <SelectItem value="sftp">SFTP Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Storage Usage</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Used: 2.3 GB</span>
                      <span>Available: 97.7 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '2.3%'}}></div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Start Backup Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>Track all system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input placeholder="Search logs..." className="flex-1" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">CREATE</SelectItem>
                    <SelectItem value="UPDATE">UPDATE</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="VIEW">VIEW</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.resource}</Badge>
                      </TableCell>
                      <TableCell className="max-w-64 truncate">{log.details}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Current system status and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">System Version</Label>
                    <p className="text-sm text-muted-foreground">v2.1.3</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Build Date</Label>
                    <p className="text-sm text-muted-foreground">2024-01-10</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Database Version</Label>
                    <p className="text-sm text-muted-foreground">PostgreSQL 14.2</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Uptime</Label>
                    <p className="text-sm text-muted-foreground">15 days, 8 hours</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">License Information</Label>
                  <div className="mt-2 p-3 border rounded bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Enterprise License</p>
                        <p className="text-xs text-muted-foreground">Valid until: 2024-12-31</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Server Resources</CardTitle>
                <CardDescription>Current resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '23%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>67% (5.4 GB / 8 GB)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk Usage</span>
                    <span>45% (225 GB / 500 GB)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Network I/O</span>
                    <span>2.3 MB/s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Core system services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Web Server", status: "running", icon: Globe },
                  { name: "Database", status: "running", icon: Database },
                  { name: "RFID Service", status: "running", icon: Wifi },
                  { name: "Notification Service", status: "running", icon: Bell },
                  { name: "Backup Service", status: "running", icon: HardDrive },
                  { name: "API Gateway", status: "error", icon: Activity }
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <service.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    {service.status === "running" ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Running
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>Maintenance and diagnostic tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart System Services
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download System Logs
                </Button>
                <Separator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Reset
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Emergency System Reset</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all system settings to defaults and restart all services. 
                        This action cannot be undone. Are you absolutely sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Reset System
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
