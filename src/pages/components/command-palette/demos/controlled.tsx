import * as React from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";
import { Copy, Trash, RefreshCw, Download, Share2 } from "lucide-react";
import { message } from "@/components/ui/message";

export default function ControlledDemo() {
  const [open, setOpen] = React.useState(false);

  const items: CommandItem[] = [
    { key: "copy-link", label: "Copy Share Link", icon: <Copy className="size-4" />, shortcut: "⌘C", onSelect: () => message.success("Link copied to clipboard") },
    { key: "refresh", label: "Sync Remote Data", icon: <RefreshCw className="size-4" />, shortcut: "⌘R", onSelect: () => message.info("Data refreshed") },
    { key: "export", label: "Export as PDF Report", icon: <Download className="size-4" />, onSelect: () => message.success("Export started") },
    { key: "share", label: "Invite Collaborators", icon: <Share2 className="size-4" />, onSelect: () => message.info("Opened share dialog") },
    { key: "delete", label: "Delete Project", icon: <Trash className="size-4 text-error" />, disabled: true, description: "Insufficient permissions" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button type="primary" onClick={() => setOpen(true)}>
          Show Quick Actions
        </Button>
      </div>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        placeholder="Type an action name…"
        emptyText="No matching actions found."
      />
    </div>
  );
}
