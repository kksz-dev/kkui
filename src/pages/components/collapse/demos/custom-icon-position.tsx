import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is panel header 1 with arrow at the end",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel header 2 with arrow at the end",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel header 3 with arrow at the end",
    children: <p>{text}</p>,
  },
];

export default function CustomIconPositionDemo() {
  return <Collapse expandIconPosition="end" defaultActiveKey={["1"]} items={items} />;
}
