import { useState } from "react";
import { Mail } from "lucide-react";
import { Menu, type ItemType, type MenuTheme } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";

export default function Demo() {
  const [theme, setTheme] = useState<MenuTheme>("light");
  const [current, setCurrent] = useState("1");
  const items: ItemType[] = [
    {
      key: "sub1",
      icon: <Mail />,
      label: "Navigation One",
      theme,
      children: [
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
      ],
    },
    { key: "5", label: "Option 5" },
    { key: "6", label: "Option 6" },
  ];
  return (
    <>
      <Switch checked={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} checkedChildren="Dark" unCheckedChildren="Light" />
      <br />
      <br />
      <Menu onClick={(e) => setCurrent(e.key)} className="w-64" openKeys={["sub1"]} selectedKeys={[current]} mode="vertical" items={items} />
    </>
  );
}
