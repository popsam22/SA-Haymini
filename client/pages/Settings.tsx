import { useState } from "react";
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
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle,
  AlertTriangle,
  Globe,
  Database,
  Wifi,
  Bell,
  HardDrive,
  Activity,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure system-wide settings and administrative controls
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>
                  Basic system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system-name">System Name</Label>
                  <Input
                    id="system-name"
                    defaultValue="RFID Management System"
                  />
                </div>
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="RFID Solutions Inc." />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Block all non-admin access
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send email alerts and reports
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send SMS alerts for critical events
                    </p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    defaultValue="admin@rfidsystem.com"
                    type="email"
                  />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
                <CardDescription>
                  Configure authentication and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">
                      Require Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce 2FA for all admin users
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-complexity">
                      Strong Password Policy
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce complex password requirements
                    </p>
                  </div>
                  <Switch id="password-complexity" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="min-password-length">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="min-password-length"
                    type="number"
                    defaultValue="8"
                  />
                </div>
                <div>
                  <Label htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue="120"
                  />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Security</CardTitle>
                <CardDescription>
                  Configure API access and rate limiting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-enabled">Enable API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow external API connections
                    </p>
                  </div>
                  <Switch id="api-enabled" defaultChecked />
                </div>
                <div>
                  <Label htmlFor="api-rate-limit">
                    Rate Limit (requests/minute)
                  </Label>
                  <Input id="api-rate-limit" type="number" defaultValue="100" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-logging">Log API Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Track all API usage
                    </p>
                  </div>
                  <Switch id="api-logging" defaultChecked />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>
                  Configure email service for notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input id="smtp-server" defaultValue="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                <div>
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input
                    id="smtp-username"
                    defaultValue="admin@rfidsystem.com"
                  />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>
                  WhatsApp Business API configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Ready to Configure
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    WhatsApp Business API can be configured for messaging.
                  </p>
                </div>
                <div>
                  <Label htmlFor="whatsapp-token">Business API Token</Label>
                  <Input
                    id="whatsapp-token"
                    type="password"
                    placeholder="••••••••••••••••••••••••"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp-phone">Business Phone Number</Label>
                  <Input id="whatsapp-phone" placeholder="+1-555-000-0000" />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save WhatsApp Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  Current system status and details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      System Version
                    </Label>
                    <p className="text-sm text-muted-foreground">v2.1.3</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Build Date</Label>
                    <p className="text-sm text-muted-foreground">2024-01-10</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Database Version
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      PostgreSQL 14.2
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Uptime</Label>
                    <p className="text-sm text-muted-foreground">
                      15 days, 8 hours
                    </p>
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
                  {
                    name: "Notification Service",
                    status: "running",
                    icon: Bell,
                  },
                  {
                    name: "Backup Service",
                    status: "running",
                    icon: HardDrive,
                  },
                  { name: "API Gateway", status: "error", icon: Activity },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between"
                  >
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
