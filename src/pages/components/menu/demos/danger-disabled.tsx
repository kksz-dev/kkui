import { Mail, AppWindow, Trash2, Ban } from "lucide-react";
import { Menu, type ItemType } from "@/components/ui/menu";

const items: ItemType[] = [
  { key: "1", icon: <Mail />, label: "Normal item" },
  { key: "2", icon: <Ban />, label: "Disabled item", disabled: true },
  { key: "3", icon: <Trash2 />, label: "Danger item", danger: true },
  { key: "4", icon: <Trash2 />, label: "Danger + disabled", danger: true, disabled: true },
  { type: "divider" },
  {
    key: "sub1",
    icon: <AppWindow />,
    label: "Disabled submenu",
    disabled: true,
    children: [{ key: "5", label: "Option 5" }],
  },
  {
    key: "sub2",
    icon: <AppWindow />,
    label: "Submenu with danger",
    children: [
      { key: "6", label: "Option 6" },
      { key: "7", label: "Delete", danger: true },
    ],
  },
];

export default function Demo() {
  return <Menu className="w-64" mode="inline" defaultOpenKeys={["sub2"]} defaultSelectedKeys={["3"]} items={items} />;
}
