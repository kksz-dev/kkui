import { Dropdown, type DropdownItemType } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "1st menu item" },
  { key: "2", label: "2nd menu item" },
  { key: "3", label: "3rd menu item" },
];

export default function Demo() {
  return (
    <Dropdown menu={{ items }} trigger="contextMenu">
      <div className="flex h-[200px] items-center justify-center rounded-md bg-fill-quaternary text-text-secondary select-none">
        Right Click on here
      </div>
    </Dropdown>
  );
}
