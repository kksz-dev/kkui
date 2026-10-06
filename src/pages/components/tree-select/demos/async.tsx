import { useState } from "react";
import { TreeSelect, type TreeSelectNode } from "@/components/ui/tree-select";

export default function Demo() {
  const [value, setValue] = useState<string>();
  const [treeData, setTreeData] = useState<TreeSelectNode[]>([
    { id: 1, pId: 0, value: "1", title: "Expand to load" },
    { id: 2, pId: 0, value: "2", title: "Expand to load" },
    { id: 3, pId: 0, value: "3", title: "Tree Node", isLeaf: true },
  ]);

  const genTreeNode = (parentId: number, isLeaf = false): TreeSelectNode => {
    const random = Math.random().toString(36).substring(2, 6);
    return { id: random, pId: parentId, value: random, title: isLeaf ? "Tree Node" : "Expand to load", isLeaf };
  };

  const onLoadData = ({ id }: TreeSelectNode) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setTreeData(treeData.concat([genTreeNode(id as number, false), genTreeNode(id as number, true), genTreeNode(id as number, true)]));
        resolve();
      }, 300);
    });

  return (
    <TreeSelect
      treeDataSimpleMode={{ rootPId: 0 }}
      className="w-full"
      value={value}
      popupStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select"
      onChange={setValue}
      loadData={onLoadData}
      treeData={treeData}
    />
  );
}
