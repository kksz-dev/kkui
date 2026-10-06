import { Apple, Bot, Chrome } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Apple",
    icon: <Apple className="size-4" />,
    children: "Apple ecosystem apps and configurations.",
  },
  {
    key: "2",
    label: "Android",
    icon: <Bot className="size-4" />,
    children: "Android open platform tooling and services.",
  },
  {
    key: "3",
    label: "Chrome",
    icon: <Chrome className="size-4" />,
    children: "Chrome browser extensions and web platforms.",
  },
];

export default function IconDemo() {
  return <Tabs defaultActiveKey="1" items={items} />;
}
