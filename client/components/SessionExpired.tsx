import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle } from "lucide-react";

export function SessionExpired() {
  const handleReturnToLogin = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle className="text-destructive">Session Expired</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your login session has expired. Please sign in again to continue.
          </p>
          <Button onClick={handleReturnToLogin} className="w-full">
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}