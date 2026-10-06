import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is ghost panel header 1",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is ghost panel header 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is ghost panel header 3",
    children: <p>{text}</p>,
  },
];

export default function GhostDemo() {
  return <Collapse ghost defaultActiveKey={["1"]} items={items} />;
}
