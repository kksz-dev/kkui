import { ChevronDown } from "lucide-react";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: <a href="https://kkui.kksz.dev" target="_blank" rel="noopener noreferrer">1st menu item</a> },
  { key: "2", label: <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">2nd menu item (disabled)</a>, disabled: true },
  { key: "3", label: <a href="https://www.luohanacademy.com" target="_blank" rel="noopener noreferrer">3rd menu item (disabled)</a>, disabled: true },
  { key: "4", danger: true, label: "a danger item" },
];

export default function Demo() {
  return (
    <Dropdown menu={{ items }}>
      <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
        Hover me
        <ChevronDown className="size-3.5" />
      </a>
    </Dropdown>
  );
}
