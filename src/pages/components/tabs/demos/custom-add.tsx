import * as React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";

export default function CustomAddDemo() {
  const [items, setItems] = React.useState([
    { key: "1", label: "Tab 1", children: "Content of Tab 1" },
    { key: "2", label: "Tab 2", children: "Content of Tab 2" },
  ]);
  const [activeKey, setActiveKey] = React.useState("1");

  const addTab = () => {
    const key = String(items.length + 1);
    setItems([...items, { key, label: `New Tab ${key}`, children: `Content of new tab ${key}` }]);
    setActiveKey(key);
  };

  return (
    <div className="space-y-4">
      <Button icon={<Sparkles className="size-4" />} onClick={addTab}>
        Add Tab from outside
      </Button>
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={(key, action) => {
          if (action === "remove") {
            setItems(items.filter((it) => it.key !== key));
          }
        }}
        items={items}
      />
    </div>
  );
}
