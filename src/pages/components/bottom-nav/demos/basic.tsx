import * as React from "react";
import { BottomNav, BottomNavSpacer } from "@/components/ui/bottom-nav";
import { CalendarDays, Home, Inbox, User } from "lucide-react";

export default function BasicDemo() {
  const [active, setActive] = React.useState("home");

  return (
    <div className="relative flex h-64 flex-col overflow-hidden rounded-xl border border-border bg-bg-layout [transform:translateZ(0)]">
      <div className="min-h-0 flex-1 p-6 text-sm text-text-secondary">Selected: {active}</div>
      <BottomNavSpacer />
      <BottomNav
        activeKey={active}
        onChange={setActive}
        items={[
          { key: "home", label: "Home", icon: <Home /> },
          { key: "schedule", label: "Schedule", icon: <CalendarDays /> },
          { key: "inbox", label: "Inbox", icon: <Inbox />, badge: 9, badgeLabel: "9 unread messages" },
          { key: "profile", label: "Profile", icon: <User /> },
        ]}
      />
    </div>
  );
}
