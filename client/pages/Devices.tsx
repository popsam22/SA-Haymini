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
  Radio,
  Plus,
  Search,
  Settings,
  Power,
  PowerOff,
  Edit,
  MapPin,
  Wifi,
  Shield,
  Calendar
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: string;
  organization: string;
  location: string;
  status: "active" | "offline" | "maintenance";
  lastSeen: string;
  firmware: string;
  ipAddress: string;
  macAddress: string;
  signalStrength: number;
  batteryLevel?: number;
}

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const devices: Device[] = [
    {
      id: "DEV-001",
      name: "Main Entrance Scanner",
      type: "Door Reader",
      organization: "TechCorp HQ",
      location: "Building A - Main Entrance",
      status: "active",
      lastSeen: "2 min ago",
      firmware: "v2.1.3",
      ipAddress: "192.168.1.101",
      macAddress: "00:1B:44:11:3A:B7",
      signalStrength: 85,
      batteryLevel: 92
    },
    {
      id: "DEV-002",
      name: "Lab Access Reader",
      type: "Proximity Card Reader",
      organization: "Innovation Lab",
      location: "Research Wing - Lab 205",
      status: "active",
      lastSeen: "5 min ago",
      firmware: "v2.1.3",
      ipAddress: "192.168.1.102",
      macAddress: "00:1B:44:11:3A:B8",
      signalStrength: 78
    },
    {
      id: "DEV-003",
      name: "Parking Gate Scanner",
      type: "Vehicle Reader",
      organization: "TechCorp HQ",
      location: "Parking Lot - Gate B",
      status: "offline",
      lastSeen: "2 hours ago",
      firmware: "v2.0.8",
      ipAddress: "192.168.1.103",
      macAddress: "00:1B:44:11:3A:B9",
      signalStrength: 0
    },
    {
      id: "DEV-004",
      name: "Cafeteria Entry",
      type: "Multi-factor Reader",
      organization: "Metro University",
      location: "Student Center - Cafeteria",
      status: "active",
      lastSeen: "1 min ago",
      firmware: "v2.1.3",
      ipAddress: "192.168.1.104",
      macAddress: "00:1B:44:11:3A:C0",
      signalStrength: 92,
      batteryLevel: 88
    },
    {
      id: "DEV-005",
      name: "Library Scanner",
      type: "Book Check-out Reader",
      organization: "Metro University",
      location: "Library - 3rd Floor",
      status: "maintenance",
      lastSeen: "30 min ago",
      firmware: "v2.1.2",
      ipAddress: "192.168.1.105",
      macAddress: "00:1B:44:11:3A:C1",
      signalStrength: 67
    }
  ];

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return <Wifi className="h-4 w-4 text-green-600" />;
    if (strength > 50) return <Wifi className="h-4 w-4 text-yellow-600" />;
    if (strength > 0) return <Wifi className="h-4 w-4 text-red-600" />;
    return <Wifi className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RFID Devices</h1>
          <p className="text-muted-foreground mt-1">
            Manage and configure your RFID device infrastructure
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Device</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New RFID Device</DialogTitle>
              <DialogDescription>
                Configure a new RFID device for your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-name" className="text-right">Name</Label>
                <Input id="device-name" placeholder="Device name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="door-reader">Door Reader</SelectItem>
                    <SelectItem value="proximity-card">Proximity Card Reader</SelectItem>
                    <SelectItem value="vehicle-reader">Vehicle Reader</SelectItem>
                    <SelectItem value="multi-factor">Multi-factor Reader</SelectItem>
                    <SelectItem value="book-checkout">Book Check-out Reader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organization" className="text-right">Organization</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp HQ</SelectItem>
                    <SelectItem value="innovation-lab">Innovation Lab</SelectItem>
                    <SelectItem value="metro-university">Metro University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" placeholder="Physical location" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ip-address" className="text-right">IP Address</Label>
                <Input id="ip-address" placeholder="192.168.1.x" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mac-address" className="text-right">MAC Address</Label>
                <Input id="mac-address" placeholder="00:1B:44:11:3A:B7" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>Add Device</Button>
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
                placeholder="Search devices by name, organization, or ID..."
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
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Radio className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <CardDescription>{device.type}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(device.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Device ID:</span>
                  <span className="font-mono">{device.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Organization:</span>
                  <span>{device.organization}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Location:
                  </span>
                  <span className="text-right text-xs">{device.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Seen:</span>
                  <span>{device.lastSeen}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    Signal:
                  </span>
                  <div className="flex items-center space-x-1">
                    {getSignalIcon(device.signalStrength)}
                    <span>{device.signalStrength}%</span>
                  </div>
                </div>
                {device.batteryLevel && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Battery:</span>
                    <span>{device.batteryLevel}%</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDevice(device)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Configure Device: {selectedDevice?.name}</DialogTitle>
                      <DialogDescription>
                        Modify device settings and configuration parameters.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedDevice && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="config-name">Device Name</Label>
                            <Input id="config-name" defaultValue={selectedDevice.name} />
                          </div>
                          <div>
                            <Label htmlFor="config-location">Location</Label>
                            <Input id="config-location" defaultValue={selectedDevice.location} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="config-ip">IP Address</Label>
                            <Input id="config-ip" defaultValue={selectedDevice.ipAddress} />
                          </div>
                          <div>
                            <Label htmlFor="config-firmware">Firmware Version</Label>
                            <Input id="config-firmware" defaultValue={selectedDevice.firmware} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="config-security">Security Settings</Label>
                          <Textarea
                            id="config-security"
                            placeholder="Enter security configuration parameters..."
                            className="min-h-20"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="biometric" className="rounded" />
                            <Label htmlFor="biometric">Enable Biometric Authentication</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notifications" className="rounded" />
                            <Label htmlFor="notifications">Enable Notifications</Label>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsConfigDialogOpen(false)}>
                        Save Configuration
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {device.status === "active" ? (
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
