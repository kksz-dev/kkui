import { Tabs } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Card Tab 1",
    children: "Content of card tab 1",
  },
  {
    key: "2",
    label: "Card Tab 2",
    children: "Content of card tab 2",
  },
  {
    key: "3",
    label: "Card Tab 3",
    children: "Content of card tab 3",
  },
];

export default function CardDemo() {
  return <Tabs type="card" defaultActiveKey="1" items={items} />;
}
