import * as React from "react";
import { Tree, type DataNode, type Key } from "@/components/ui/tree";

const treeData: DataNode[] = [
  {
    title: "0-0",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
      {
        title: "0-0-2",
        key: "0-0-2",
      },
    ],
  },
  {
    title: "0-1",
    key: "0-1",
    children: [
      { title: "0-1-0-0", key: "0-1-0-0" },
      { title: "0-1-0-1", key: "0-1-0-1" },
      { title: "0-1-0-2", key: "0-1-0-2" },
    ],
  },
  {
    title: "0-2",
    key: "0-2",
  },
];

export default function Demo() {
  const [expandedKeys, setExpandedKeys] = React.useState<Key[]>(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = React.useState<Key[]>(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = React.useState<Key[]>([]);

  return (
    <div className="space-y-4">
      <Tree
        checkable
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        checkedKeys={checkedKeys}
        onCheck={(keys) => {
          if (Array.isArray(keys)) {
            setCheckedKeys(keys);
          } else {
            setCheckedKeys(keys.checked);
          }
        }}
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
        treeData={treeData}
      />
      <div className="text-xs text-text-secondary">
        <div><strong>Expanded:</strong> {expandedKeys.join(", ")}</div>
        <div><strong>Checked:</strong> {checkedKeys.join(", ")}</div>
        <div><strong>Selected:</strong> {selectedKeys.join(", ")}</div>
      </div>
    </div>
  );
}
