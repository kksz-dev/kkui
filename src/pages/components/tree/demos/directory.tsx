import { TreeDirectoryTree, type DataNode } from "@/components/ui/tree";

const treeData: DataNode[] = [
  {
    title: "parent 0",
    key: "0-0",
    children: [
      { title: "leaf 0-0", key: "0-0-0", isLeaf: true },
      { title: "leaf 0-1", key: "0-0-1", isLeaf: true },
    ],
  },
  {
    title: "parent 1",
    key: "0-1",
    children: [
      { title: "leaf 1-0", key: "0-1-0", isLeaf: true },
      { title: "leaf 1-1", key: "0-1-1", isLeaf: true },
    ],
  },
];

export default function Demo() {
  return (
    <TreeDirectoryTree
      multiple
      defaultExpandAll
      defaultSelectedKeys={["0-0-0"]}
      treeData={treeData}
    />
  );
}
