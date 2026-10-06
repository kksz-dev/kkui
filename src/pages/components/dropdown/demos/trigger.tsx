import { ChevronDown } from "lucide-react";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "1st menu item" },
  { key: "2", label: "2nd menu item" },
  { key: "3", label: "3rd menu item" },
];

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-6">
      <Dropdown menu={{ items }} trigger="hover">
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
          Hover me
          <ChevronDown className="size-3.5" />
        </a>
      </Dropdown>
      <Dropdown menu={{ items }} trigger="click">
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
          Click me
          <ChevronDown className="size-3.5" />
        </a>
      </Dropdown>
    </div>
  );
}
