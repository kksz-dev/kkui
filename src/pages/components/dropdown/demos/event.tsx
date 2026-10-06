import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dropdown, type DropdownItemType, type DropdownMenuInfo } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "1st menu item" },
  { key: "2", label: "2nd menu item" },
  { key: "3", label: "3rd menu item" },
];

export default function Demo() {
  const [last, setLast] = useState<string>();
  const [open, setOpen] = useState(false);
  const onClick = ({ key }: DropdownMenuInfo) => setLast(key);
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Dropdown menu={{ items, onClick }}>
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
          Hover me, Click menu item
          <ChevronDown className="size-3.5" />
        </a>
      </Dropdown>
      <Dropdown
        menu={{ items: [...items, { type: "divider" }, { key: "close", label: "Close the menu" }], onClick: ({ key }) => key === "close" && setOpen(false) }}
        open={open}
        onOpenChange={(next, info) => {
          // keep the menu open when an item is clicked
          if (info?.source === "trigger" || next) setOpen(next);
        }}
        trigger="click"
      >
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
          Controlled
          <ChevronDown className="size-3.5" />
        </a>
      </Dropdown>
      <span className="text-text-secondary">last clicked: {last ?? "-"}</span>
    </div>
  );
}
