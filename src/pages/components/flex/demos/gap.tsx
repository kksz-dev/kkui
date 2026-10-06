import { useState } from "react";
import { Flex, type FlexGap } from "@/components/ui/flex";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [gap, setGap] = useState<FlexGap>("sm");
  const [custom, setCustom] = useState(24);
  const presets = ["sm", "md", "lg", "custom"] as const;
  const active = typeof gap === "number" ? "custom" : gap;
  return (
    <Flex gap="md" vertical>
      <div className="inline-flex self-start rounded-md border border-border p-0.5">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setGap(p === "custom" ? custom : p)}
            aria-pressed={active === p}
            className={`rounded-sm px-3 py-1 text-sm ${active === p ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
          >
            {p === "sm" ? "small" : p === "md" ? "middle" : p === "lg" ? "large" : "customize"}
          </button>
        ))}
      </div>
      {active === "custom" && (
        <label className="flex items-center gap-3 text-sm">
          <input
            type="range"
            min={0}
            max={100}
            value={custom}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCustom(v);
              setGap(v);
            }}
            className="w-56 accent-primary"
          />
          <span className="text-text-secondary">{custom}px</span>
        </label>
      )}
      <Flex gap={gap} wrap>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
      </Flex>
    </Flex>
  );
}
