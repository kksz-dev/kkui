import { useState } from "react";
import { Mail, AppWindow, Settings } from "lucide-react";
import { Menu, type ItemType, type MenuMode, type MenuTheme } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";

const items: ItemType[] = [
  {
    key: "1",
    icon: <Mail />,
    label: "Navigation One",
  },
  {
    key: "2",
    icon: <Settings />,
    label: "Navigation Two",
  },
  {
    key: "sub1",
    label: "Navigation Three",
    icon: <AppWindow />,
    children: [
      { key: "3", label: "Option 3" },
      { key: "4", label: "Option 4" },
      { key: "sub1-2", label: "Submenu", children: [{ key: "5", label: "Option 5" }, { key: "6", label: "Option 6" }] },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Four",
    icon: <Settings />,
    children: [
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
    ],
  },
];

export default function Demo() {
  const [mode, setMode] = useState<MenuMode>("inline");
  const [theme, setTheme] = useState<MenuTheme>("light");
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-2">
          <Switch checked={mode === "vertical"} onChange={(v) => setMode(v ? "vertical" : "inline")} />
          <span className="text-sm font-medium text-text">Change Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} />
          <span className="text-sm font-medium text-text">Change Style</span>
        </div>
      </div>
      <br />
      <Menu className="w-64" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode={mode} theme={theme} items={items} />
    </>
  );
}
