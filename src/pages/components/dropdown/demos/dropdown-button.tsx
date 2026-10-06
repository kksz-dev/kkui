import { ChevronDown, User } from "lucide-react";
import { DropdownButton, type DropdownItemType, type DropdownMenuInfo } from "@/components/ui/dropdown";
import { Tooltip } from "@/components/ui/tooltip";

const items: DropdownItemType[] = [
  { key: "1", label: "1st menu item", icon: <User /> },
  { key: "2", label: "2nd menu item", icon: <User /> },
  { key: "3", label: "3rd menu item", icon: <User />, danger: true },
  { key: "4", label: "4th menu item (disabled)", icon: <User />, danger: true, disabled: true },
];

export default function Demo() {
  const onMenuClick = (info: DropdownMenuInfo) => console.log("click", info.key);
  const menu = { items, onClick: onMenuClick };
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownButton menu={menu} onClick={() => console.log("left button clicked")}>
        Dropdown
      </DropdownButton>
      <DropdownButton menu={menu} placement="bottom" icon={<User />}>
        Dropdown
      </DropdownButton>
      <DropdownButton menu={menu} disabled>
        Dropdown
      </DropdownButton>
      <DropdownButton menu={menu} type="primary" icon={<ChevronDown />}>
        Primary
      </DropdownButton>
      <DropdownButton menu={menu} danger>
        Danger
      </DropdownButton>
      <DropdownButton
        menu={menu}
        buttonsRender={([left, right]) => [
          <Tooltip title="tooltip" key="left">
            {left}
          </Tooltip>,
          right,
        ]}
      >
        With buttonsRender
      </DropdownButton>
    </div>
  );
}
