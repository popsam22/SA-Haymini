import { PlaceholderPage } from "../components/PlaceholderPage";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Users Management"
      description="Manage users, assign them to devices and departments"
      icon={Users}
    />
  );
}
