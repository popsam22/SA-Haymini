import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Radio,
  Building2,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Devices",
      value: "24",
      description: "Active RFID devices",
      icon: Radio,
      trend: "+2 this month",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Organizations",
      value: "8",
      description: "Schools & firms registered",
      icon: Building2,
      trend: "+1 this week",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Users",
      value: "1,247",
      description: "Users with access cards",
      icon: Users,
      trend: "+23 today",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "System Health",
      value: "98.5%",
      description: "Uptime this month",
      icon: Activity,
      trend: "Excellent",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const recentDevices = [
    { id: "DEV-001", name: "Main Entrance Scanner", organization: "TechCorp HQ", status: "active", lastSeen: "2 min ago" },
    { id: "DEV-002", name: "Lab Access Reader", organization: "Innovation Lab", status: "active", lastSeen: "5 min ago" },
    { id: "DEV-003", name: "Parking Gate Scanner", organization: "TechCorp HQ", status: "offline", lastSeen: "2 hours ago" },
    { id: "DEV-004", name: "Cafeteria Entry", organization: "Metro University", status: "active", lastSeen: "1 min ago" },
    { id: "DEV-005", name: "Library Scanner", organization: "Metro University", status: "maintenance", lastSeen: "30 min ago" }
  ];

  const alerts = [
    { id: 1, type: "warning", message: "Device DEV-003 has been offline for 2 hours", time: "2 hours ago" },
    { id: 2, type: "info", message: "New organization 'Metro University' added successfully", time: "4 hours ago" },
    { id: 3, type: "success", message: "Biometric system updated for 3 devices", time: "1 day ago" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "offline":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Offline</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your RFID device infrastructure
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/devices">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Device</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Devices */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Device Activity</CardTitle>
              <CardDescription>Latest status updates from your RFID devices</CardDescription>
            </div>
            <Link to="/devices">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Radio className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{device.name}</div>
                      <div className="text-sm text-muted-foreground">{device.organization}</div>
                      <div className="text-xs text-muted-foreground">ID: {device.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(device.status)}
                    <div className="text-xs text-muted-foreground mt-1">{device.lastSeen}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent notifications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/notifications">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Alerts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/devices">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Radio className="h-6 w-6" />
                <span>Manage Devices</span>
              </Button>
            </Link>
            <Link to="/organizations">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Building2 className="h-6 w-6" />
                <span>Add Organization</span>
              </Button>
            </Link>
            <Link to="/users">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link to="/device-control">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Activity className="h-6 w-6" />
                <span>Device Control</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
