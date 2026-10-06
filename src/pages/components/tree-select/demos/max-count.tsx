import { useState } from "react";
import { TreeSelect } from "@/components/ui/tree-select";

const MAX_COUNT = 3;

const treeData = [
  {
    title: "Parent 1",
    value: "parent1",
    children: [
      { title: "Child 1-1", value: "child1-1" },
      { title: "Child 1-2", value: "child1-2" },
      { title: "Child 1-3", value: "child1-3" },
    ],
  },
  {
    title: "Parent 2",
    value: "parent2",
    children: [
      { title: "Child 2-1", value: "child2-1" },
      { title: "Child 2-2", value: "child2-2" },
    ],
  },
];

export default function Demo() {
  const [value, setValue] = useState<string[]>(["child1-1"]);

  const suffix = (
    <span className="text-xs">
      {value.length} / {MAX_COUNT}
    </span>
  );

  return (
    <TreeSelect
      treeData={treeData}
      value={value}
      onChange={setValue}
      multiple
      maxCount={MAX_COUNT}
      className="w-full"
      suffixIcon={suffix}
      treeDefaultExpandAll
      placeholder="Please select"
    />
  );
}
