import * as React from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/command-palette";
import { CalendarDays, FileText, Gauge, Plus, Settings, Users } from "lucide-react";

export default function BasicDemo() {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState("");

  const items = [
    { key: "new-visit", label: "New visit", icon: <Plus />, shortcut: "N", group: "Actions", onSelect: () => setLast("New visit") },
    { key: "new-claim", label: "New claim batch", icon: <FileText />, group: "Actions", onSelect: () => setLast("New claim batch") },
    { key: "dashboard", label: "Dashboard", icon: <Gauge />, group: "Go to", keywords: ["home", "overview"], onSelect: () => setLast("Dashboard") },
    { key: "patients", label: "Patients", icon: <Users />, group: "Go to", onSelect: () => setLast("Patients") },
    { key: "schedule", label: "Schedule", icon: <CalendarDays />, group: "Go to", onSelect: () => setLast("Schedule") },
    { key: "settings", label: "Settings", icon: <Settings />, group: "Go to", description: "Theme, language, shortcuts", onSelect: () => setLast("Settings") },
  ];

  return (
    <div className="space-y-3">
      <Button type="primary" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <p className="text-xs text-text-tertiary">
        Or press <kbd className="rounded border border-border px-1 font-mono">Ctrl/⌘ K</kbd> anywhere on this page.
      </p>
      {last && <p className="text-sm text-text">Ran: {last}</p>}

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        footer={
          <span className="flex gap-3">
            <span>↑↓ navigate</span>
            <span>↵ run</span>
            <span>esc close</span>
          </span>
        }
      />
    </div>
  );
}
