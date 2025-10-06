import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Organization {
  id: number;
  name: string;
}

interface CSVUploadProps {
  organizations: Organization[];
}

interface UploadResult {
  status: string;
  message: string;
  csv_parsing?: {
    total_rows_processed: number;
    valid_rows: number;
    invalid_rows: number;
    parsing_errors: string[];
  };
  user_creation?: {
    created: number;
    updated: number;
    errors: number;
    details: string[];
  };
  invalid_rows_details?: Array<{
    row_number: number;
    data: any;
    errors: string[];
  }>;
}

export function CSVUpload({ organizations }: CSVUploadProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: ({ file, orgId }: { file: File; orgId?: number }) =>
      apiClient.uploadUsersFromCSV(file, orgId),
    onSuccess: (result: UploadResult) => {
      setUploadResult(result);
      queryClient.invalidateQueries({ queryKey: ["users"] });

      if (result.status === 'success') {
        toast({
          title: "CSV Upload Successful",
          description: `Created ${result.user_creation?.created || 0} users, updated ${result.user_creation?.updated || 0} users.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CSV file",
        variant: "destructive",
      });
    },
  });

  const downloadTemplateMutation = useMutation({
    mutationFn: () => apiClient.downloadCSVTemplate(),
    onSuccess: (response: any) => {
      // Handle CSV template download
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Template Downloaded",
        description: "CSV template downloaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download template",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    const orgId = selectedOrganization ? parseInt(selectedOrganization) : undefined;
    uploadMutation.mutate({ file: selectedFile, orgId });
  };

  const handleDownloadTemplate = () => {
    downloadTemplateMutation.mutate();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setSelectedOrganization("");
    setUploadResult(null);
    setIsUploadDialogOpen(false);
  };

  return (
    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload CSV</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Upload Users from CSV</span>
          </DialogTitle>
          <DialogDescription>
            Bulk import users by uploading a CSV file with the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Download Template Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Step 1: Download Template</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Download the CSV template to ensure your file has the correct format.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                disabled={downloadTemplateMutation.isPending}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadTemplateMutation.isPending ? "Downloading..." : "Download Template"}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Step 2: Upload Your File</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="organization">Default Organization (Optional)</Label>
                <Select
                  value={selectedOrganization || "none"}
                  onValueChange={(value) => setSelectedOrganization(value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default organization</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used for users without an organization_id in the CSV
                </p>
              </div>

              <div>
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
                {selectedFile && (
                  <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Required CSV columns:</strong> punching_code, name, email, phone
                  <br />
                  <strong>Optional:</strong> organization_id
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Upload Result */}
          {uploadResult && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  {uploadResult.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Upload Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {uploadResult.csv_parsing && (
                  <div className="text-sm">
                    <p><strong>Parsing Results:</strong></p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>Total rows processed: {uploadResult.csv_parsing.total_rows_processed}</li>
                      <li>Valid rows: {uploadResult.csv_parsing.valid_rows}</li>
                      <li>Invalid rows: {uploadResult.csv_parsing.invalid_rows}</li>
                    </ul>
                  </div>
                )}

                {uploadResult.user_creation && (
                  <div className="text-sm">
                    <p><strong>User Creation Results:</strong></p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li className="text-green-600">Created: {uploadResult.user_creation.created}</li>
                      <li className="text-blue-600">Updated: {uploadResult.user_creation.updated}</li>
                      <li className="text-red-600">Errors: {uploadResult.user_creation.errors}</li>
                    </ul>
                  </div>
                )}

                {uploadResult.invalid_rows_details && uploadResult.invalid_rows_details.length > 0 && (
                  <div className="text-sm">
                    <p><strong>Invalid Rows:</strong></p>
                    <div className="max-h-32 overflow-y-auto bg-muted p-2 rounded text-xs">
                      {uploadResult.invalid_rows_details.map((row, index) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium">Row {row.row_number}:</p>
                          <ul className="list-disc list-inside ml-2">
                            {row.errors.map((error, errorIndex) => (
                              <li key={errorIndex} className="text-red-600">{error}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetUpload}>
            {uploadResult ? "Close" : "Cancel"}
          </Button>
          {!uploadResult && (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload CSV"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}