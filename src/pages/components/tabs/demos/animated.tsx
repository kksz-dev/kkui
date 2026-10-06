import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of Tab Pane 1 with smooth animation",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2 with smooth animation",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3 with smooth animation",
  },
];

export default function AnimatedDemo() {
  const [animated, setAnimated] = React.useState(true);

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setAnimated(!animated)}>
        Toggle Animation: {animated ? "ON" : "OFF"}
      </Button>
      <Tabs animated={animated} defaultActiveKey="1" items={items} />
    </div>
  );
}
