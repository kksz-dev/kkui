import { useState } from "react";
import { Flex } from "@/components/ui/flex";

export default function Demo() {
  const [vertical, setVertical] = useState(false);
  return (
    <Flex gap="md" vertical>
      <div className="inline-flex self-start rounded-md border border-border p-0.5">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => setVertical(v)}
            aria-pressed={vertical === v}
            className={`rounded-sm px-3 py-1 text-sm ${vertical === v ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
          >
            {v ? "vertical" : "horizontal"}
          </button>
        ))}
      </div>
      <Flex vertical={vertical}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`h-[54px] w-1/4 ${i % 2 ? "bg-primary/75" : "bg-primary"}`} />
        ))}
      </Flex>
    </Flex>
  );
}
