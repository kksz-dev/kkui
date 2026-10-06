import * as React from "react";
import { Tabs, type TabItem } from "@/components/ui/tabs";

const initialItems: TabItem[] = [
  { key: "1", label: "Tab 1", children: "Content of Tab 1" },
  { key: "2", label: "Tab 2", children: "Content of Tab 2" },
  { key: "3", label: "Tab 3", closable: false, children: "Content of Tab 3 (Unclosable)" },
];

export default function EditableCardDemo() {
  const [activeKey, setActiveKey] = React.useState("1");
  const [items, setItems] = React.useState(initialItems);
  const newTabIndex = React.useRef(0);

  const onEdit = (targetKey: string | React.MouseEvent | React.KeyboardEvent, action: "add" | "remove") => {
    if (action === "add") {
      const newActiveKey = `newTab${newTabIndex.current++}`;
      const newPanes = [...items];
      newPanes.push({
        key: newActiveKey,
        label: `New Tab`,
        children: "New Tab Pane Content",
      });
      setItems(newPanes);
      setActiveKey(newActiveKey);
    } else {
      let newActiveKey = activeKey;
      let lastIndex = -1;
      items.forEach((item, i) => {
        if (item.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const newPanes = items.filter((item) => item.key !== targetKey);
      if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
        } else {
          newActiveKey = newPanes[0].key;
        }
      }
      setItems(newPanes);
      setActiveKey(newActiveKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      activeKey={activeKey}
      onChange={setActiveKey}
      onEdit={onEdit}
      items={items}
    />
  );
}
