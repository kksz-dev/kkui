import * as React from "react";
import { Tree, type DataNode, type Key } from "@/components/ui/tree";

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
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [{ title: "leaf", key: "0-0-1-0" }],
      },
    ],
  },
];

export default function Demo() {
  const [checkedKeys, setCheckedKeys] = React.useState<{ checked: Key[]; halfChecked: Key[] }>({
    checked: ["0-0-0"],
    halfChecked: [],
  });

  return (
    <div className="space-y-4">
      <Tree
        checkable
        checkStrictly
        defaultExpandedKeys={["0-0-0", "0-0-1"]}
        checkedKeys={checkedKeys}
        onCheck={(keys) => {
          if (!Array.isArray(keys)) {
            setCheckedKeys(keys);
          }
        }}
        treeData={treeData}
      />
      <div className="text-xs text-text-secondary">
        <strong>Checked keys:</strong> {checkedKeys.checked.join(", ")}
      </div>
    </div>
  );
}
