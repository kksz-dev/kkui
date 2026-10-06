import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This panel can only be triggered by clicking the icon",
    collapsible: "icon",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is a disabled panel (cannot expand)",
    collapsible: "disabled",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This panel can be triggered by clicking anywhere on the header",
    collapsible: "header",
    children: <p>{text}</p>,
  },
];

export default function CollapsibleDemo() {
  return <Collapse defaultActiveKey={["1", "3"]} items={items} />;
}
