import { ArrowRight } from "lucide-react";
import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
    className: "border-b-0",
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
    className: "border-b-0",
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
    className: "border-b-0",
  },
];

export default function CustomPanelDemo() {
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <ArrowRight className={`size-3.5 transition-transform duration-mid ${isActive ? "rotate-90 text-primary" : ""}`} />
      )}
      items={items}
    />
  );
}
