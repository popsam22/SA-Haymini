import { PlaceholderPage } from "../components/PlaceholderPage";
import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <PlaceholderPage
      title="Notification Settings"
      description="Configure SMS, email, and WhatsApp notification preferences"
      icon={Bell}
    />
  );
}
