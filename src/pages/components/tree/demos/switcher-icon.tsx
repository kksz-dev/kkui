import { Tree, type DataNode } from "@/components/ui/tree";
import { ChevronDown, Plus, Minus } from "lucide-react";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    switcherIcon: <ChevronDown className="size-3.5 text-primary" />,
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
      showLine
      switcherIcon={({ expanded }) =>
        expanded ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />
      }
      defaultExpandedKeys={["0-0-0"]}
      treeData={treeData}
    />
  );
}
