import * as React from "react";
import { Tree, type DataNode } from "@/components/ui/tree";
import { Switch } from "@/components/ui/switch";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          { title: "leaf", key: "0-0-0-0" },
          { title: "leaf", key: "0-0-0-1" },
          { title: "leaf", key: "0-0-0-2" },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [{ title: "leaf", key: "0-0-1-0" }],
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        children: [
          { title: "leaf", key: "0-0-2-0" },
          { title: "leaf", key: "0-0-2-1" },
        ],
      },
    ],
  },
  {
    title: "parent 2",
    key: "0-1",
    children: [
      {
        title: "parent 2-0",
        key: "0-1-0",
        children: [
          { title: "leaf", key: "0-1-0-0" },
          { title: "leaf", key: "0-1-0-1" },
        ],
      },
    ],
  },
];

export default function Demo() {
  const [showLine, setShowLine] = React.useState(true);
  const [showLeafIcon, setShowLeafIcon] = React.useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <span>Show Line:</span>
          <Switch checked={showLine} onChange={setShowLine} />
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <span>Show Leaf Icon:</span>
          <Switch checked={showLeafIcon} onChange={setShowLeafIcon} disabled={!showLine} />
        </label>
      </div>

      <Tree
        showLine={showLine ? { showLeafIcon } : false}
        defaultExpandedKeys={["0-0-0", "0-0-1"]}
        treeData={treeData}
      />
    </div>
  );
}
