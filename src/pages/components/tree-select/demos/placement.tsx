import { useState } from "react";
import { TreeSelect } from "@/components/ui/tree-select";
import type { SelectPlacement } from "@/components/ui/select";

const treeData = [
  {
    value: "parent 1",
    title: "parent 1",
    children: [
      { value: "parent 1-0", title: "parent 1-0", children: [{ value: "leaf1", title: "leaf1" }, { value: "leaf2", title: "leaf2" }] },
      { value: "parent 1-1", title: "parent 1-1", children: [{ value: "leaf3", title: "leaf3" }] },
    ],
  },
];

const placements: SelectPlacement[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

export default function Demo() {
  const [placement, setPlacement] = useState<SelectPlacement>("topLeft");

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-md border border-border text-sm">
        {placements.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlacement(p)}
            className={`px-3 py-1 first:rounded-l-md last:rounded-r-md ${placement === p ? "bg-primary text-white" : "hover:text-primary"}`}
          >
            {p}
          </button>
        ))}
      </div>
      <TreeSelect showSearch popupStyle={{ maxHeight: 400, overflow: "auto", minWidth: 300 }} placeholder="Please select" popupMatchSelectWidth={false} placement={placement} treeDefaultExpandAll treeData={treeData} className="w-30" />
    </div>
  );
}
