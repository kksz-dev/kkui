import * as React from "react";
import { Tree, type DataNode } from "@/components/ui/tree";

const initTreeData: DataNode[] = [
  { title: "Expand to load", key: "0" },
  { title: "Expand to load", key: "1" },
  { title: "Tree Node", key: "2", isLeaf: true },
];

function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return { ...node, children: updateTreeData(node.children, key, children) };
    }
    return node;
  });
}

export default function Demo() {
  const [treeData, setTreeData] = React.useState<DataNode[]>(initTreeData);

  const onLoadData = ({ key, children }: DataNode): Promise<void> => {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, key, [
            { title: `Child Node ${key}-0`, key: `${key}-0` },
            { title: `Child Node ${key}-1`, key: `${key}-1` },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  return <Tree loadData={onLoadData} treeData={treeData} />;
}
