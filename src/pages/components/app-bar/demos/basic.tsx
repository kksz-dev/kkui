import * as React from "react";
import { AppBar } from "@/components/ui/app-bar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";

export default function BasicDemo() {
  const [active, setActive] = React.useState("dashboard");

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <AppBar
        sticky={false}
        logo={<span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">K</span>}
        title="Console"
        activeKey={active}
        onSelect={setActive}
        items={[
          { key: "dashboard", label: "Dashboard" },
          { key: "patients", label: "Patients" },
          { key: "reports", label: "Reports" },
          { key: "settings", label: "Settings", disabled: true },
        ]}
        actions={
          <>
            <Button variant="text" size="sm" aria-label="Search" icon={<Search className="size-4" />} />
            <Badge count={3}>
              <Button variant="text" size="sm" aria-label="Notifications" icon={<Bell className="size-4" />} />
            </Badge>
            <Avatar size="sm">KS</Avatar>
          </>
        }
      />
      <div className="bg-bg-layout p-6 text-sm text-text-secondary">Active section: {active}</div>
    </div>
  );
}
