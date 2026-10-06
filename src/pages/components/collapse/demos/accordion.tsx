import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "In accordion mode, only one panel can be expanded at a time.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
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

export default function AccordionDemo() {
  return <Collapse accordion defaultActiveKey="1" items={items} />;
}
