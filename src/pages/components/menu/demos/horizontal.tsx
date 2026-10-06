import { useState } from "react";
import { Mail, AppWindow, Settings } from "lucide-react";
import { Menu, type ItemType } from "@/components/ui/menu";

const items: ItemType[] = [
  { label: "Navigation One", key: "mail", icon: <Mail /> },
  { label: "Navigation Two", key: "app", icon: <AppWindow />, disabled: true },
  {
    label: "Navigation Three - Submenu",
    key: "SubMenu",
    icon: <Settings />,
    children: [
      { type: "group", label: "Item 1", children: [{ label: "Option 1", key: "setting:1" }, { label: "Option 2", key: "setting:2" }] },
      { type: "group", label: "Item 2", children: [{ label: "Option 3", key: "setting:3" }, { label: "Option 4", key: "setting:4" }] },
    ],
  },
  {
    key: "link",
    label: <a href="https://kkui.kksz.dev" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>,
  },
];

export default function Demo() {
  const [current, setCurrent] = useState("mail");
  return <Menu mode="horizontal" selectedKeys={[current]} onClick={(e) => setCurrent(e.key)} items={items} />;
}
