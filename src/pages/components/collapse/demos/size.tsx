import * as React from "react";
import { Button } from "@/components/ui/button";
import { Collapse, type CollapseItem, type CollapseSize } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is small size panel header",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is another panel header",
    children: <p>{text}</p>,
  },
];

export default function SizeDemo() {
  const [size, setSize] = React.useState<CollapseSize>("sm");

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
      <Collapse size={size} defaultActiveKey={["1"]} items={items} />
    </div>
  );
}
