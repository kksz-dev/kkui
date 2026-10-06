import { useState } from "react";
import { Folder, File } from "lucide-react";
import { TreeSelect } from "@/components/ui/tree-select";
import { Switch } from "@/components/ui/switch";

const treeData = [
  {
    value: "parent 1",
    title: "parent 1",
    icon: <Folder />,
    children: [
      {
        value: "parent 1-0",
        title: "parent 1-0",
        icon: <Folder />,
        children: [
          { value: "leaf1", title: "leaf1", icon: <File /> },
          { value: "leaf2", title: "leaf2", icon: <File /> },
        ],
      },
      {
        value: "parent 1-1",
        title: "parent 1-1",
        icon: <Folder />,
        children: [{ value: "sss", title: "sss", icon: <File /> }],
      },
    ],
  },
];

export default function Demo() {
  const [treeLine, setTreeLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          treeLine <Switch checked={treeLine} onChange={setTreeLine} />
        </label>
        <label className="flex items-center gap-2">
          treeIcon <Switch checked={showIcon} onChange={setShowIcon} />
        </label>
      </div>
      <TreeSelect treeLine={treeLine} treeIcon={showIcon} className="w-75" treeData={treeData} treeDefaultExpandAll placeholder="Please select" />
    </div>
  );
}
