import { ChevronDown } from "lucide-react";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "Item 1" },
  { key: "2", label: "Item 2" },
  { key: "3", label: "Item 3" },
];

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-6">
      <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: ["3"] }}>
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
          Selectable
          <ChevronDown className="size-3.5" />
        </a>
      </Dropdown>
      <Dropdown menu={{ items, selectable: true, multiple: true, defaultSelectedKeys: ["1", "2"] }} trigger="click">
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
          Multiple
          <ChevronDown className="size-3.5" />
        </a>
      </Dropdown>
    </div>
  );
}
