import { Mail, Settings, User, LogOut } from "lucide-react";
import { Menu, type ItemType } from "@/components/ui/menu";

const items: ItemType[] = [
  { key: "1", icon: <User />, label: "Profile", extra: "⌘P" },
  { key: "2", icon: <Mail />, label: "Inbox", extra: <span className="rounded-full bg-error px-1.5 text-[10px] leading-4 text-white">12</span> },
  { key: "3", icon: <Settings />, label: "Settings", extra: "⌘," },
  { type: "divider" },
  { key: "4", icon: <LogOut />, label: "Log out", danger: true },
];

export default function Demo() {
  return <Menu className="w-64" mode="inline" defaultSelectedKeys={["1"]} items={items} />;
}
