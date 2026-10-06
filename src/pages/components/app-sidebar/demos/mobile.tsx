import * as React from "react";
import { AppBar } from "@/components/ui/app-bar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Gauge, Inbox, Settings, Users } from "lucide-react";

const items = [
  { key: "overview", label: "Overview", icon: <Gauge /> },
  { key: "inbox", label: "Inbox", icon: <Inbox />, badge: 5 },
  { key: "team", label: "Team", icon: <Users /> },
  { key: "settings", label: "Settings", icon: <Settings /> },
];

export default function MobileDemo() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("overview");

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <AppBar sticky={false} title="Mobile shell" onMenuClick={() => setOpen(true)} />
      <div className="bg-bg-layout p-6 text-sm text-text-secondary">
        Tap the menu button — the sidebar slides in over the page with a mask behind it.
        <div className="mt-2 text-text">Selected: {active}</div>
      </div>

      <AppSidebar mode="drawer" items={items} open={open} onOpenChange={setOpen} activeKey={active} onSelect={setActive} collapsible={false} />
    </div>
  );
}
