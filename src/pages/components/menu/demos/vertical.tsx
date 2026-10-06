import { Mail, AppWindow, Settings } from "lucide-react";
import { Menu, type ItemType, type MenuInfo } from "@/components/ui/menu";

const items: ItemType[] = [
  {
    key: "sub1",
    label: "Navigation One",
    icon: <Mail />,
    children: [
      { key: "g1", label: "Item 1", type: "group", children: [{ key: "1", label: "Option 1" }, { key: "2", label: "Option 2" }] },
      { key: "g2", label: "Item 2", type: "group", children: [{ key: "3", label: "Option 3" }, { key: "4", label: "Option 4" }] },
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
  const onClick = (e: MenuInfo) => console.log("click", e);
  return <Menu onClick={onClick} className="w-64" mode="vertical" items={items} />;
}
