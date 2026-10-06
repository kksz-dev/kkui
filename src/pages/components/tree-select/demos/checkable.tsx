import { useState } from "react";
import { SHOW_PARENT, TreeSelect } from "@/components/ui/tree-select";

const treeData = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
    children: [
      { title: "Child Node1", value: "0-0-0", key: "0-0-0" },
    ],
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1",
    children: [
      { title: "Child Node3", value: "0-1-0", key: "0-1-0" },
      { title: "Child Node4", value: "0-1-1", key: "0-1-1" },
      { title: "Child Node5", value: "0-1-2", key: "0-1-2" },
    ],
  },
];

export default function Demo() {
  const [value, setValue] = useState(["0-0-0"]);

  const onChange = (newValue: string[]) => {
    console.log("onChange ", newValue);
    setValue(newValue);
  };

  return (
    <TreeSelect
      treeData={treeData}
      value={value}
      onChange={onChange}
      treeCheckable
      showCheckedStrategy={SHOW_PARENT}
      placeholder="Please select"
      className="w-full"
    />
  );
}
