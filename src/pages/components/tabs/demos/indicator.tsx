import { Tabs } from "@/components/ui/tabs";

const items = [
  {
    key: "1",
    label: "Short Tab",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Much Longer Tab Name",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3",
  },
];

export default function IndicatorDemo() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-xs text-text-tertiary">Fixed 24px center indicator:</div>
        <Tabs
          defaultActiveKey="1"
          items={items}
          indicator={{ size: 24, align: "center" }}
        />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-tertiary">Half-width start-aligned indicator:</div>
        <Tabs
          defaultActiveKey="1"
          items={items}
          indicator={{ size: (origin) => origin / 2, align: "start" }}
        />
      </div>
    </div>
  );
}
