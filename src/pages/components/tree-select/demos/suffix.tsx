import { Smile, User } from "lucide-react";
import { TreeSelect } from "@/components/ui/tree-select";

const treeData = [
  {
    value: "parent 1",
    title: "parent 1",
    children: [
      { value: "parent 1-0", title: "parent 1-0", children: [{ value: "leaf1", title: "leaf1" }, { value: "leaf2", title: "leaf2" }] },
    ],
  },
];

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <TreeSelect prefix={<User className="text-text-tertiary" />} className="w-full" placeholder="Please select" treeData={treeData} treeDefaultExpandAll />
      <TreeSelect suffixIcon={<Smile />} className="w-full" placeholder="Please select" treeData={treeData} treeDefaultExpandAll />
    </div>
  );
}
