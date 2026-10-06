import { Settings } from "lucide-react";
import { Collapse, type CollapseItem } from "@/components/ui/collapse";

const text = "A dog is a type of domesticated animal known for its loyalty and faithfulness.";

const items: CollapseItem[] = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
    extra: <Settings className="size-4 hover:text-primary transition-colors cursor-pointer" />,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
    extra: <Settings className="size-4 hover:text-primary transition-colors cursor-pointer" />,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
    extra: <Settings className="size-4 hover:text-primary transition-colors cursor-pointer" />,
  },
];

export default function ExtraDemo() {
  return <Collapse defaultActiveKey={["1"]} items={items} />;
}
