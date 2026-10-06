import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is panel header 1 (arrow hidden)",
    showArrow: false,
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
  },
];

export default function NoArrowDemo() {
  return <Collapse defaultActiveKey={["1"]} items={items} />;
}
