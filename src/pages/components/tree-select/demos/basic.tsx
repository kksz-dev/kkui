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
          { value: "leaf1", title: "leaf1" },
          { value: "leaf2", title: "leaf2" },
          { value: "leaf3", title: "leaf3" },
          { value: "leaf4", title: "leaf4" },
          { value: "leaf5", title: "leaf5" },
          { value: "leaf6", title: "leaf6" },
        ],
      },
      {
        value: "parent 1-1",
        title: "parent 1-1",
        children: [{ value: "leaf11", title: <b className="text-[#08c]">leaf11</b> }],
      },
    ],
  },
];

export default function Demo() {
  const [value, setValue] = useState<string>();

  return (
    <TreeSelect
      showSearch
      className="w-full"
      value={value}
      popupStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select"
      allowClear
      treeDefaultExpandAll
      onChange={setValue}
      treeData={treeData}
    />
  );
}
