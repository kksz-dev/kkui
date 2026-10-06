import { ChevronDown } from "lucide-react";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "My Account", disabled: true },
  { type: "divider" },
  { key: "2", label: "Profile", extra: "⌘P" },
  { key: "3", label: "Billing", extra: "⌘B" },
  { key: "4", label: "Settings", extra: "⌘S" },
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
