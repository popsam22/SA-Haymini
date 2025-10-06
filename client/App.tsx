import "./global.css";

// Suppress harmless ResizeObserver error from Radix UI components
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes(
      "ResizeObserver loop completed with undelivered notifications",
    ) ||
      args[0].includes("ResizeObserver loop limit exceeded"))
  ) {
    return;
  }
  originalError(...args);
};

// Also suppress at window level for completeness
window.addEventListener("error", (e) => {
  if (
    e.message &&
    (e.message.includes(
      "ResizeObserver loop completed with undelivered notifications",
    ) ||
      e.message.includes("ResizeObserver loop limit exceeded"))
  ) {
    e.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (e) => {
  if (
    e.reason &&
    e.reason.message &&
    (e.reason.message.includes(
      "ResizeObserver loop completed with undelivered notifications",
    ) ||
      e.reason.message.includes("ResizeObserver loop limit exceeded"))
  ) {
    e.preventDefault();
    return false;
  }
});

import { Toaster } from "@/components/ui/toaster";
import { createRoot, type Root } from "react-dom/client";

// Extend HTMLElement type to include our custom _reactRoot property
declare global {
  interface HTMLElement {
    _reactRoot?: Root;
  }
}
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginForm } from "./components/LoginForm";
import { RootRedirect } from "./components/RootRedirect";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Organizations from "./pages/Organizations";
import Admins from "./pages/Admins";
import UsersPage from "./pages/Users";
import DeviceAssignments from "./pages/DeviceAssignments";
import Cards from "./pages/Cards";
import DeviceControl from "./pages/DeviceControl";
import Biometrics from "./pages/Biometrics";
import Attendance from "./pages/Attendance";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Devices />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Organizations />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admins"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Admins />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <UsersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/device-assignments"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <DeviceAssignments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cards"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Cards />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/device-control"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <DeviceControl />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/biometrics"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Biometrics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Attendance />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <Notifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Ensure root is only created once to avoid double mounting
const container = document.getElementById("root")!;
if (!container._reactRoot) {
  const root = createRoot(container);
  container._reactRoot = root;
  root.render(<App />);
} else {
  container._reactRoot.render(<App />);
}
