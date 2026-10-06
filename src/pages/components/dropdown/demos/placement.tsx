import { Button } from "@/components/ui/button";
import { Dropdown, type DropdownItemType, type DropdownPlacement } from "@/components/ui/dropdown";

const items: DropdownItemType[] = [
  { key: "1", label: <a href="https://kkui.kksz.dev" target="_blank" rel="noopener noreferrer">1st menu item</a> },
  { key: "2", label: <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">2nd menu item</a> },
  { key: "3", label: <a href="https://www.luohanacademy.com" target="_blank" rel="noopener noreferrer">3rd menu item</a> },
];

const placements: DropdownPlacement[] = ["bottomLeft", "bottom", "bottomRight", "topLeft", "top", "topRight"];

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {placements.map((placement) => (
        <Dropdown key={placement} menu={{ items }} placement={placement}>
          <Button>{placement}</Button>
        </Dropdown>
      ))}
    </div>
  );
}
