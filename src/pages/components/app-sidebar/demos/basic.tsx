import * as React from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { CalendarDays, FileText, Gauge, Settings, Stethoscope, Users } from "lucide-react";

const items = [
  { key: "group-main", label: "Main", type: "group" as const, children: [
    { key: "overview", label: "Overview", icon: <Gauge /> },
    { key: "patients", label: "Patients", icon: <Users />, badge: 12 },
    { key: "appointments", label: "Appointments", icon: <CalendarDays /> },
  ]},
  { key: "group-clinical", label: "Clinical", type: "group" as const, children: [
    {
      key: "records",
      label: "Records",
      icon: <FileText />,
      children: [
        { key: "records-opd", label: "OPD" },
        { key: "records-ipd", label: "IPD" },
        { key: "records-lab", label: "Laboratory" },
      ],
    },
    { key: "procedures", label: "Procedures", icon: <Stethoscope /> },
  ]},
  { type: "divider" as const },
  { key: "settings", label: "Settings", icon: <Settings /> },
];

export default function BasicDemo() {
  const [active, setActive] = React.useState("records-opd");

  return (
    <div className="flex h-[420px] overflow-hidden rounded-xl border border-border">
      <AppSidebar
        items={items}
        activeKey={active}
        onSelect={setActive}
        header={<span className="flex items-center gap-2 font-semibold text-sidebar-text"><span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm text-white">K</span>KKUI</span>}
        footer={
          <div className="flex items-center gap-2 px-1 py-1 text-xs text-sidebar-text/70">
            <Avatar size="sm">KS</Avatar>
            <span className="truncate">kksz@kksz.dev</span>
          </div>
        }
      />
      <div className="flex-1 bg-bg-layout p-6 text-sm text-text-secondary">Selected: {active}</div>
    </div>
  );
}
