import { ChevronDown } from "lucide-react";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  {
    key: "1",
    type: "group",
    label: "Group title",
    children: [
      { key: "1-1", label: "1st menu item" },
      { type: "divider" },
      { key: "1-2", label: "2nd menu item" },
      { key: "1-3", label: "group submenu", children: [{ key: "1-3-1", label: "inside a group" }] },
    ],
  },
  {
    key: "2",
    label: "sub menu",
    title: "Opens on hover or click",
    children: [
      { key: "2-1", label: "3rd menu item" },
      { key: "2-2", label: "4th menu item" },
      { key: "2-3", label: "deeper", children: [{ key: "2-3-1", label: "5th menu item" }, { key: "2-3-2", label: "6th menu item" }] },
    ],
  },
  { key: "3", label: "disabled sub menu", disabled: true, children: [{ key: "3-1", label: "7th menu item" }, { key: "3-2", label: "8th menu item" }] },
];

export default function Demo() {
  return (
    <Dropdown menu={{ items, onClick: ({ key, keyPath }) => console.log(key, keyPath) }}>
      <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
        Cascading menu
        <ChevronDown className="size-3.5" />
      </a>
    </Dropdown>
  );
}
