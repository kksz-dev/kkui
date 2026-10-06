import { useState } from "react";
import { Cascader } from "@/components/ui/cascader";
import type { SelectPlacement } from "@/components/ui/select";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [{ value: "hangzhou", label: "Hangzhou", children: [{ value: "xihu", label: "West Lake" }] }],
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
      <Cascader options={options} placement={placement} placeholder="Please select" />
    </div>
  );
}
