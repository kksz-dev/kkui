import { Button } from "@/components/ui/button";
import { Dropdown, type DropdownItemType, type DropdownPlacement } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: "1st menu item" },
  { key: "2", label: "2nd menu item" },
  { key: "3", label: "3rd menu item" },
];

const placements: DropdownPlacement[] = ["bottomLeft", "bottom", "bottomRight", "topLeft", "top", "topRight"];

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {placements.map((placement) => (
        <Dropdown key={placement} menu={{ items }} placement={placement} arrow={{ pointAtCenter: true }}>
          <Button>{placement}</Button>
        </Dropdown>
      ))}
    </div>
  );
}
