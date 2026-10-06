import { Tree, type DataNode } from "@/components/ui/tree";

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
  return (
    <Tree
      blockNode
      showLine
      defaultExpandedKeys={["0-0-0"]}
      defaultSelectedKeys={["0-0-0-0"]}
      treeData={treeData}
    />
  );
}
