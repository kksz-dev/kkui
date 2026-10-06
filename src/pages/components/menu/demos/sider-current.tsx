import { useState } from "react";
import { Mail, AppWindow, Settings } from "lucide-react";
import { Menu, type ItemType } from "@/components/ui/menu";

const items: ItemType[] = [
  {
    key: "sub1",
    icon: <Mail />,
    label: "Navigation One",
    children: [
      { key: "1", label: "Option 1" },
      { key: "2", label: "Option 2" },
      { key: "3", label: "Option 3" },
      { key: "4", label: "Option 4" },
    ],
  },
  {
    key: "sub2",
    icon: <AppWindow />,
    label: "Navigation Two",
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

const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

export default function Demo() {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (latestOpenKey && !rootSubmenuKeys.includes(latestOpenKey)) setOpenKeys(keys);
    else setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };
  return <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} className="w-64" items={items} />;
}
