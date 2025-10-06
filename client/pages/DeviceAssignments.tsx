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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Plus,
  Search,
  Users,
  Radio,
  Building2,
  UserPlus,
  UserMinus,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Assignment {
  id: number;
  user_id: number;
  device_serial: string;
  organization_id: number;
  user_name?: string;
  device_name?: string;
  organization_name?: string;
  assigned_at?: string;
  assigned_by?: string;
}

interface User {
  id: number;
  name: string;
  punching_code: string;
  email: string;
  organization_id: number;
  organization_name?: string;
}

interface Device {
  serial_number: string;
  device_name: string;
  organization_id: number;
  organization_name?: string;
}

interface Organization {
  id: number;
  name: string;
}

export default function DeviceAssignments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: organizationsResponse,
    isLoading: isLoadingOrgs,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.getOrganizations(),
  });

  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.getUsers(),
  });

  const {
    data: devicesResponse,
    isLoading: isLoadingDevices,
  } = useQuery({
    queryKey: ["devices"],
    queryFn: () => apiClient.getDevices(),
  });

  // Get assignments for selected organization
  const {
    data: assignmentsResponse,
    isLoading: isLoadingAssignments,
  } = useQuery({
    queryKey: ["device-assignments", selectedOrganization],
    queryFn: () =>
      selectedOrganization
        ? apiClient.getOrganizationDeviceAssignments(parseInt(selectedOrganization))
        : Promise.resolve([]),
    enabled: !!selectedOrganization,
  });

  // Process data
  const organizations = Array.isArray(organizationsResponse)
    ? organizationsResponse
    : (organizationsResponse as any)?.organizations || [];

  const users = Array.isArray(usersResponse) ? usersResponse : [];
  const devices = Array.isArray(devicesResponse) ? devicesResponse : [];
  const assignments = Array.isArray(assignmentsResponse)
    ? assignmentsResponse
    : (assignmentsResponse as any)?.assignments || [];

  // Filter data by organization
  const filteredUsers = users.filter((user: User) =>
    !selectedOrganization || user.organization_id.toString() === selectedOrganization
  );

  const filteredDevices = devices.filter((device: Device) =>
    !selectedOrganization || device.organization_id.toString() === selectedOrganization
  );

  const filteredAssignments = assignments.filter((assignment: Assignment) =>
    assignment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.device_serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignMutation = useMutation({
    mutationFn: (data: {
      user_ids: number[];
      device_serial: string;
      organization_id: number;
    }) => {
      if (data.user_ids.length === 1) {
        return apiClient.assignUserToDevice({
          user_id: data.user_ids[0],
          device_serial: data.device_serial,
          organization_id: data.organization_id,
        });
      } else {
        return apiClient.bulkAssignUsersToDevice(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-assignments"] });
      setIsAssignDialogOpen(false);
      setSelectedDevice("");
      setSelectedUsers([]);
      toast({
        title: "Assignment Successful",
        description: "Users assigned to device successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign users to device",
        variant: "destructive",
      });
    },
  });

  const unassignMutation = useMutation({
    mutationFn: ({ userId, deviceSerial }: { userId: number; deviceSerial: string }) =>
      apiClient.removeUserFromDevice(userId, deviceSerial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-assignments"] });
      toast({
        title: "Unassignment Successful",
        description: "User removed from device successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Unassignment Failed",
        description: error.message || "Failed to remove user from device",
        variant: "destructive",
      });
    },
  });

  const handleAssignUsers = () => {
    if (!selectedDevice || selectedUsers.length === 0 || !selectedOrganization) {
      toast({
        title: "Invalid Selection",
        description: "Please select a device and at least one user.",
        variant: "destructive",
      });
      return;
    }

    assignMutation.mutate({
      user_ids: selectedUsers,
      device_serial: selectedDevice,
      organization_id: parseInt(selectedOrganization),
    });
  };

  const handleUnassign = (assignment: Assignment) => {
    unassignMutation.mutate({
      userId: assignment.user_id,
      deviceSerial: assignment.device_serial,
    });
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (isLoadingOrgs || isLoadingUsers || isLoadingDevices) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading device assignments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Manage user access to RFID devices by organization
          </p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center space-x-2"
              disabled={!selectedOrganization}
            >
              <Plus className="h-4 w-4" />
              <span>Assign Users</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Assign Users to Device</DialogTitle>
              <DialogDescription>
                Select a device and users to grant access permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="device-select">Select Device</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a device" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDevices.map((device: Device) => (
                      <SelectItem key={device.serial_number} value={device.serial_number}>
                        {device.device_name} ({device.serial_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Users ({selectedUsers.length} selected)</Label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                  {filteredUsers.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-muted rounded"
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.punching_code} • {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignUsers}
                disabled={assignMutation.isPending || !selectedDevice || selectedUsers.length === 0}
              >
                {assignMutation.isPending ? "Assigning..." : "Assign Users"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org-filter">Filter by Organization</Label>
              <Select
                value={selectedOrganization || "all"}
                onValueChange={(value) => setSelectedOrganization(value === "all" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map((org: Organization) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search Assignments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by user name or device..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5" />
            <span>Current Assignments</span>
            {selectedOrganization && (
              <Badge variant="secondary">
                {organizations.find((o: Organization) => o.id.toString() === selectedOrganization)?.name}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {selectedOrganization
              ? `Showing assignments for selected organization (${filteredAssignments.length} total)`
              : "Select an organization to view assignments"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedOrganization ? (
            isLoadingAssignments ? (
              <div className="flex items-center justify-center h-32">
                Loading assignments...
              </div>
            ) : filteredAssignments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment: Assignment) => (
                    <TableRow key={`${assignment.user_id}-${assignment.device_serial}`}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{assignment.user_name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {assignment.user_id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Radio className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{assignment.device_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {assignment.device_serial}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.assigned_at
                          ? new Date(assignment.assigned_at).toLocaleDateString()
                          : "N/A"
                        }
                      </TableCell>
                      <TableCell>{assignment.assigned_by || "System"}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUnassign(assignment)}
                          disabled={unassignMutation.isPending}
                        >
                          <Unlink className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No device assignments found for this organization.</p>
                <p className="text-sm">Create assignments using the "Assign Users" button above.</p>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please select an organization to view device assignments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}