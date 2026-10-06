import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, type TabSize } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of tab 1",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of tab 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of tab 3",
  },
];

export default function SizeDemo() {
  const [size, setSize] = React.useState<TabSize>("sm");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" type={size === "sm" ? "primary" : "default"} onClick={() => setSize("sm")}>
          Small
        </Button>
        <Button size="sm" type={size === "md" ? "primary" : "default"} onClick={() => setSize("md")}>
          Middle
        </Button>
        <Button size="sm" type={size === "lg" ? "primary" : "default"} onClick={() => setSize("lg")}>
          Large
        </Button>
      </div>
      <Tabs size={size} defaultActiveKey="1" items={items} />
    </div>
  );
}
