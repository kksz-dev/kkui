import { useState } from "react";
import { Mail, AppWindow, Settings } from "lucide-react";
import { Menu, type ItemType, type MenuTheme } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";

const items: ItemType[] = [
  {
    key: "sub1",
    label: "Navigation One",
    icon: <Mail />,
    children: [
      { key: "1", label: "Option 1" },
      { key: "2", label: "Option 2" },
      { key: "3", label: "Option 3" },
      { key: "4", label: "Option 4" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppWindow />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "sub3", label: "Submenu", children: [{ key: "7", label: "Option 7" }, { key: "8", label: "Option 8" }] },
    ],
  },
  {
    key: "sub4",
    label: "Navigation Three",
    icon: <Settings />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      { key: "11", label: "Option 11" },
      { key: "12", label: "Option 12" },
    ],
  },
];

export default function Demo() {
  const [theme, setTheme] = useState<MenuTheme>("dark");
  const [current, setCurrent] = useState("1");
  return (
    <>
      <Switch checked={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} checkedChildren="Dark" unCheckedChildren="Light" />
      <br />
      <br />
      <Menu theme={theme} onClick={(e) => setCurrent(e.key)} className="w-64" defaultOpenKeys={["sub1"]} selectedKeys={[current]} mode="inline" items={items} />
    </>
  );
}
