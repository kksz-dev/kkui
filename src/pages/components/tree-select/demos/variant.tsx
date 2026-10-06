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
      <TreeSelect className="w-full" placeholder="Outlined" treeData={treeData} treeDefaultExpandAll />
      <TreeSelect className="w-full" placeholder="Filled" variant="filled" treeData={treeData} treeDefaultExpandAll />
      <TreeSelect className="w-full" placeholder="Borderless" variant="borderless" treeData={treeData} treeDefaultExpandAll />
      <TreeSelect className="w-full" placeholder="Underlined" variant="underlined" treeData={treeData} treeDefaultExpandAll />
    </div>
  );
}
