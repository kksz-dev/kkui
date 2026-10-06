import * as React from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";
import { Moon, Sun, Monitor, Laptop, Globe } from "lucide-react";
import { message } from "@/components/ui/message";

export default function CustomFilterDemo() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const items: CommandItem[] = [
    { key: "theme-light", label: "Light Mode", icon: <Sun className="size-4" />, group: "Appearance", keywords: ["bright", "white", "day"], onSelect: () => message.info("Selected Light Mode") },
    { key: "theme-dark", label: "Dark Mode", icon: <Moon className="size-4" />, group: "Appearance", keywords: ["dim", "night", "black"], onSelect: () => message.info("Selected Dark Mode") },
    { key: "theme-system", label: "System Theme", icon: <Monitor className="size-4" />, group: "Appearance", keywords: ["auto", "os"], onSelect: () => message.info("Selected System Theme") },
    { key: "lang-th", label: "ภาษาไทย", icon: <Globe className="size-4" />, group: "Language", keywords: ["thai", "thailand"], onSelect: () => message.success("Switched to Thai") },
    { key: "lang-en", label: "English", icon: <Globe className="size-4" />, group: "Language", keywords: ["english", "us", "uk"], onSelect: () => message.success("Switched to English") },
    { key: "device-desk", label: "Workstation Profile", icon: <Laptop className="size-4" />, group: "Device", onSelect: () => message.info("Loaded Workstation Profile") },
  ];

  return (
    <div className="space-y-3">
      <Button onClick={() => setOpen(true)}>
        Open Preference Commands
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        value={query}
        onValueChange={setQuery}
        placeholder="Search settings, themes, or languages…"
        footer={<span className="text-xs text-text-tertiary">Type words like 'dark', 'night', 'ไทย', or 'lang'</span>}
      />
    </div>
  );
}
