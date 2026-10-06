import { useState } from "react";
import { Select, type SelectPlacement } from "@/components/ui/select";

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
      <Select
        defaultValue="HangZhou"
        className="w-30"
        popupMatchSelectWidth={false}
        placement={placement}
        options={[
          { value: "HangZhou", label: "HangZhou #310000" },
          { value: "NingBo", label: "NingBo #315000" },
          { value: "WenZhou", label: "WenZhou #325000" },
        ]}
      />
    </div>
  );
}
