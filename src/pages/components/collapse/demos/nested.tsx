import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const nestedItems: CollapseItem[] = [
  {
    key: "nested-1",
    label: "This is a nested panel header",
    children: <p>{text}</p>,
  },
];

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <Collapse defaultActiveKey={["nested-1"]} items={nestedItems} />,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
  },
];

export default function NestedDemo() {
  return <Collapse defaultActiveKey={["1"]} items={items} />;
}
