import { useState } from "react";
import { TreeSelect } from "@/components/ui/tree-select";

const treeData = [
  {
    title: "Node1",
    value: "0-0",
    children: [
      { title: "Child Node1", value: "0-0-1" },
      { title: "Child Node2", value: "0-0-2" },
    ],
  },
  { title: "Node2", value: "0-1" },
];

export default function Demo() {
  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  return <TreeSelect className="w-full" value={value} popupStyle={{ maxHeight: 400, overflow: "auto" }} treeData={treeData} placeholder="Please select" treeDefaultExpandAll onChange={onChange} />;
}
