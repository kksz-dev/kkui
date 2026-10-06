import { Tree, type DataNode } from "@/components/ui/tree";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "disabled node",
        key: "0-0-0",
        disabled: true,
        children: [
          { title: "leaf", key: "0-0-0-0" },
          { title: "leaf", key: "0-0-0-1" },
        ],
      },
      {
        title: "disable checkbox node",
        key: "0-0-1",
        disableCheckbox: true,
        children: [{ title: "leaf", key: "0-0-1-0" }],
      },
    ],
  },
];

export default function Demo() {
  return (
    <Tree
      checkable
      defaultExpandedKeys={["0-0-0", "0-0-1"]}
      defaultCheckedKeys={["0-0-0-0"]}
      treeData={treeData}
    />
  );
}
