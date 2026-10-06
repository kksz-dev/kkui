import * as React from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Gauge, Inbox, Settings, Users } from "lucide-react";

const items = [
  { key: "overview", label: "Overview", icon: <Gauge /> },
  { key: "inbox", label: "Inbox", icon: <Inbox />, badge: 5 },
  {
    key: "team",
    label: "Team",
    icon: <Users />,
    children: [
      { key: "team-members", label: "Members" },
      { key: "team-roles", label: "Roles" },
    ],
  },
  { key: "alerts", label: "Alerts", icon: <Bell /> },
  { key: "settings", label: "Settings", icon: <Settings /> },
];

export default function CollapsedDemo() {
  const [collapsed, setCollapsed] = React.useState(true);
  const [active, setActive] = React.useState("inbox");

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? "Expand" : "Collapse"}
      </Button>
      <div className="flex h-72 overflow-hidden rounded-xl border border-border">
        <AppSidebar
          items={items}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          activeKey={active}
          onSelect={setActive}
        />
        <div className="flex-1 bg-bg-layout p-6 text-sm text-text-secondary">
          Hover a rail icon to see its label, or open Team to reach its nested items.
        </div>
      </div>
    </div>
  );
}
