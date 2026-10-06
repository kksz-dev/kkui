import { useState } from "react";
import { TreeSelect } from "@/components/ui/tree-select";

const treeData = [
  {
    value: "parent 1",
    title: "parent 1",
    children: [
      {
        value: "parent 1-0",
        title: "parent 1-0",
        children: [
          { value: "leaf1", title: "my leaf" },
          { value: "leaf2", title: "your leaf" },
        ],
      },
      {
        value: "parent 1-1",
        title: "parent 1-1",
        children: [{ value: "sss", title: <b className="text-[#08c]">sss</b> }],
      },
    ],
  },
];

export default function Demo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <TreeSelect
      showSearch
      className="w-full"
      value={value}
      placeholder="Please select"
      allowClear
      multiple
      treeDefaultExpandAll
      onChange={setValue}
      treeData={treeData}
    />
  );
}
