import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: <a href="https://kkui.kksz.dev" target="_blank" rel="noopener noreferrer">1st menu item</a> },
  { key: "2", label: <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">2nd menu item (disabled)</a>, disabled: true },
  { key: "3", label: <a href="https://www.luohanacademy.com" target="_blank" rel="noopener noreferrer">3rd menu item (disabled)</a>, disabled: true },
];

export default function Demo() {
  return (
    <Dropdown
      // `className` on the menu strips the panel chrome so the custom wrapper owns it
      menu={{ items, className: "border-0 shadow-none" }}
      popupRender={(menu) => (
        <div className="rounded-lg border border-border bg-bg-elevated shadow-kk-secondary">
          {menu}
          <div className="border-t border-split" />
          <div className="flex gap-2 p-2">
            <Button type="primary" size="sm">
              Click me!
            </Button>
            <Button size="sm">Cancel</Button>
          </div>
        </div>
      )}
    >
      <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:text-primary-hover">
        Hover me
        <ChevronDown className="size-3.5" />
      </a>
    </Dropdown>
  );
}
