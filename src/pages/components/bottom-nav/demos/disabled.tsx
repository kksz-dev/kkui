import { BottomNav, BottomNavSpacer } from "@/components/ui/bottom-nav";
import { Home, Lock, Settings, User } from "lucide-react";

export default function DisabledDemo() {
  return (
    <div className="relative flex h-48 flex-col overflow-hidden rounded-xl border border-border bg-bg-layout [transform:translateZ(0)]">
      <div className="min-h-0 flex-1 p-6 text-sm text-text-secondary">Starts on Profile; Admin cannot be selected.</div>
      <BottomNavSpacer />
      <BottomNav
        defaultActiveKey="profile"
        items={[
          { key: "home", label: "Home", icon: <Home /> },
          { key: "profile", label: "Profile", icon: <User /> },
          { key: "admin", label: "Admin", icon: <Lock />, disabled: true },
          { key: "settings", label: "Settings", icon: <Settings /> },
        ]}
      />
    </div>
  );
}
