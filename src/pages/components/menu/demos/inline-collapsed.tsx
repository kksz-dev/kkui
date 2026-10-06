import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Inbox, Calendar, Mail, AppWindow, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu, type ItemType } from "@/components/ui/menu";

const items: ItemType[] = [
  { key: "1", icon: <Inbox />, label: "Option 1" },
  { key: "2", icon: <Calendar />, label: "Option 2" },
  { key: "3", icon: <Settings />, label: "Option 3" },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <Mail />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppWindow />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      { key: "sub3", label: "Submenu", children: [{ key: "11", label: "Option 11" }, { key: "12", label: "Option 12" }] },
    ],
  },
];

export default function Demo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="w-64">
      <Button type="primary" onClick={() => setCollapsed((v) => !v)} className="mb-4" icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />} />
      <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline" theme="dark" inlineCollapsed={collapsed} items={items} className="transition-[width] duration-mid ease-kk-in-out" />
    </div>
  );
}
