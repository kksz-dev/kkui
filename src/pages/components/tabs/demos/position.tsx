import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, type TabPosition } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of Tab 1",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab 3",
  },
];

export default function PositionDemo() {
  const [position, setPosition] = React.useState<TabPosition>("top");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["top", "bottom", "left", "right"] as const).map((pos) => (
          <Button
            key={pos}
            size="sm"
            type={position === pos ? "primary" : "default"}
            onClick={() => setPosition(pos)}
          >
            {pos}
          </Button>
        ))}
      </div>
      <Tabs tabPosition={position} defaultActiveKey="1" items={items} />
    </div>
  );
}
