import { Tree, type DataNode } from "@/components/ui/tree";
import { Smile, Frown, Meh } from "lucide-react";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    icon: <Smile className="size-4 text-warning" />,
    children: [
      {
        title: "leaf",
        key: "0-0-0",
        icon: <Meh className="size-4 text-info" />,
      },
      {
        title: "leaf",
        key: "0-0-1",
        icon: ({ selected }) =>
          selected ? (
            <Frown className="size-4 text-error" />
          ) : (
            <Smile className="size-4 text-success" />
          ),
      },
    ],
  },
];

export default function Demo() {
  return (
    <Tree
      showIcon
      defaultExpandedKeys={["0-0"]}
      defaultSelectedKeys={["0-0-0"]}
      treeData={treeData}
    />
  );
}
