import { useState } from "react";
import { Space, type SpaceSize } from "@/components/ui/space";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [size, setSize] = useState<SpaceSize>("sm");
  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-md border border-border p-0.5">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`rounded-sm px-3 py-1 text-sm ${size === s ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
          >
            {s === "sm" ? "Small" : s === "md" ? "Middle" : "Large"}
          </button>
        ))}
      </div>
      <Space size={size}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
      </Space>
    </div>
  );
}
