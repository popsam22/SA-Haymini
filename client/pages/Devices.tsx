import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
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
import {
  Radio,
  Plus,
  Search,
  Edit,
  MapPin,
  Shield,
  Calendar,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Building2,
  Activity,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Device {
  serial_number: string;
  device_name?: string;
  device_model?: string;
  organization_id: number;
  ip_address?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  organization_name?: string;
  // Frontend display properties
  id?: string;
  name?: string;
  mac_address?: string;
  location?: string;
}

interface DeviceFormData {
  name: string;
  serial_number: string;
  organization_id: number;
  device_model: string;
  ip_address: string;
  status: string;
}

const initialFormData: DeviceFormData = {
  name: "",
  serial_number: "",
  organization_id: 0,
  device_model: "",
  ip_address: "",
  status: "active",
};

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrganization, setFilterOrganization] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>(initialFormData);
  const [editFormData, setEditFormData] =
    useState<DeviceFormData>(initialFormData);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: devicesResponse = [],
    isLoading: devicesLoading,
    error: devicesError,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: ["devices"],
    queryFn: () => apiClient.getDevices(),
  });

  const { data: organizationsResponse = [], isLoading: orgsLoading } = useQuery(
    {
      queryKey: ["organizations"],
      queryFn: () => apiClient.getOrganizations(),
    },
  );

  const createDevice = useMutation({
    mutationFn: (data: DeviceFormData) => apiClient.createDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setFormData(initialFormData);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Device registered successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register device.",
        variant: "destructive",
      });
    },
  });

  const updateDevice = useMutation({
    mutationFn: ({
      serial_number,
      ...data
    }: { serial_number: string } & Partial<DeviceFormData>) =>
      apiClient.updateDevice(serial_number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setIsEditDialogOpen(false);
      setSelectedDevice(null);
      toast({
        title: "Success",
        description: "Device updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update device.",
        variant: "destructive",
      });
    },
  });

  // Ensure we always have arrays to work with
  const devices = Array.isArray(devicesResponse)
    ? devicesResponse
    : (devicesResponse as any)?.devices
      ? Array.isArray((devicesResponse as any).devices)
        ? (devicesResponse as any).devices
        : []
      : [];

  const organizations = Array.isArray(organizationsResponse)
    ? organizationsResponse
    : (organizationsResponse as any)?.organizations
      ? Array.isArray((organizationsResponse as any).organizations)
        ? (organizationsResponse as any).organizations
        : []
      : [];

  const filteredDevices = devices.filter((device: Device) => {
    const deviceName = device.device_name || device.name || "";
    const deviceSerial = device.serial_number || device.mac_address || "";
    const deviceModel = device.device_model || "";

    const matchesSearch =
      deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deviceSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deviceModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrganization =
      !filterOrganization ||
      filterOrganization === "all" ||
      device.organization_id.toString() === filterOrganization;

    const matchesStatus =
      !filterStatus || filterStatus === "all" || device.status === filterStatus;

    return matchesSearch && matchesOrganization && matchesStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.organization_id === 0) {
      toast({
        title: "Error",
        description: "Please select an organization.",
        variant: "destructive",
      });
      return;
    }
    await createDevice.mutateAsync(formData);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;

    await updateDevice.mutateAsync({
      serial_number: selectedDevice.serial_number,
      ...editFormData,
    });
  };

  const openEditDialog = (device: Device) => {
    setSelectedDevice(device);
    setEditFormData({
      name: device.device_name || device.name || "",
      serial_number: device.serial_number || device.mac_address || "",
      organization_id: device.organization_id || 0,
      device_model: device.device_model || "",
      ip_address: device.ip_address || "",
      status: device.status || "active",
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Offline
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (devicesLoading || orgsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">RFID Devices</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your RFID device network
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading devices...</p>
          </div>
        </div>
      </div>
    );
  }

  if (devicesError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">RFID Devices</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your RFID device network
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load devices: {(devicesError as any).message}
          </AlertDescription>
        </Alert>

        <Button onClick={() => refetchDevices()} variant="outline">
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
          <h1 className="text-3xl font-bold text-foreground">RFID Devices</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your RFID device network
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle>Register New Device</DialogTitle>
                <DialogDescription>
                  Add a new RFID device to the system and assign it to an
                  organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name *</Label>
                  <Input
                    id="device-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Main Entrance Scanner"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial-number">Serial Number *</Label>
                  <Input
                    id="serial-number"
                    value={formData.serial_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        serial_number: e.target.value,
                      }))
                    }
                    placeholder="e.g., DEV001 or 00:1B:44:11:3A:B7"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Select
                    value={
                      formData.organization_id > 0
                        ? formData.organization_id.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        organization_id: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org: any) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device-model">Device Model</Label>
                  <Input
                    id="device-model"
                    value={formData.device_model}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        device_model: e.target.value,
                      }))
                    }
                    placeholder="e.g., RFID Scanner v2.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address</Label>
                  <Input
                    id="ip-address"
                    value={formData.ip_address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ip_address: e.target.value,
                      }))
                    }
                    placeholder="e.g., 192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createDevice.isPending}>
                  {createDevice.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Device"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by device name, serial number, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filterOrganization}
              onValueChange={setFilterOrganization}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org: any) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => refetchDevices()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device: Device) => (
          <Card
            key={device.serial_number}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      {device.device_name || device.name || "RFID Device"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Serial: {device.serial_number}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(device.status || "active")}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(device)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="font-mono">{device.serial_number}</span>
              </div>

              {device.device_model && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Radio className="h-4 w-4 flex-shrink-0" />
                  <span>Model: {device.device_model}</span>
                </div>
              )}

              {device.organization_name && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span>{device.organization_name}</span>
                </div>
              )}

              {device.ip_address && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>IP: {device.ip_address}</span>
                </div>
              )}

              {device.created_at && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Registered:{" "}
                    {new Date(device.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize font-medium">
                  {device.status || "active"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDevices.length === 0 && !devicesLoading && (
        <div className="text-center py-12">
          <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Devices Found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ||
            (filterOrganization && filterOrganization !== "all") ||
            (filterStatus && filterStatus !== "all")
              ? "No devices match your current filters."
              : "Get started by registering your first RFID device."}
          </p>
          {!searchTerm &&
            (!filterOrganization || filterOrganization === "all") &&
            (!filterStatus || filterStatus === "all") && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Register Device
              </Button>
            )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Device</DialogTitle>
              <DialogDescription>
                Update device information and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Device Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Main Entrance Scanner"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-serial">Serial Number *</Label>
                <Input
                  id="edit-serial"
                  value={editFormData.serial_number}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      serial_number: e.target.value,
                    }))
                  }
                  placeholder="e.g., DEV001 or 00:1B:44:11:3A:B7"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-organization">Organization *</Label>
                <Select
                  value={
                    editFormData.organization_id > 0
                      ? editFormData.organization_id.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      organization_id: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org: any) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-model">Device Model</Label>
                <Input
                  id="edit-device-model"
                  value={editFormData.device_model}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      device_model: e.target.value,
                    }))
                  }
                  placeholder="e.g., RFID Scanner v2.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ip-address">IP Address</Label>
                <Input
                  id="edit-ip-address"
                  value={editFormData.ip_address}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      ip_address: e.target.value,
                    }))
                  }
                  placeholder="e.g., 192.168.1.100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) =>
                    setEditFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateDevice.isPending}>
                {updateDevice.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Device"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
