import { Tabs } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Tab Title 1",
    children: (
      <div className="space-y-2">
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </div>
    ),
  },
  {
    key: "2",
    label: "Tab Title 2",
    children: (
      <div className="space-y-2">
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </div>
    ),
  },
  {
    key: "3",
    label: "Tab Title 3",
    children: (
      <div className="space-y-2">
        <p>Content of Tab Pane 3</p>
      </div>
    ),
  },
];

export default function CardTopDemo() {
  return (
    <div className="rounded-lg border border-border bg-bg-container p-4">
      <Tabs type="card" defaultActiveKey="1" items={items} />
    </div>
  );
}
