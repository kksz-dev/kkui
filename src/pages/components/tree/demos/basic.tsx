import { Tree, type DataNode } from "@/components/ui/tree";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        disabled: true,
        children: [
          { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
          { title: "leaf", key: "0-0-0-1" },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [{ title: <span style={{ color: "#1677ff" }}>custom color leaf</span>, key: "0-0-1-0" }],
      },
    ],
  },
];

export default function Demo() {
  return (
    <Tree
      checkable
      defaultExpandedKeys={["0-0-0", "0-0-1"]}
      defaultSelectedKeys={["0-0-0", "0-0-1"]}
      defaultCheckedKeys={["0-0-0", "0-0-1"]}
      treeData={treeData}
    />
  );
}
