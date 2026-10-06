import { useState } from "react";
import { Flex } from "@/components/ui/flex";
import { Button } from "@/components/ui/button";

const justifyOptions = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] as const;
const alignOptions = ["flex-start", "center", "flex-end"] as const;

function Segment<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap self-start rounded-md border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`rounded-sm px-3 py-1 text-sm ${value === o ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function Demo() {
  const [justify, setJustify] = useState<(typeof justifyOptions)[number]>("flex-start");
  const [align, setAlign] = useState<(typeof alignOptions)[number]>("flex-start");
  return (
    <Flex gap="md" vertical>
      <p className="text-sm text-text-secondary">Select justify:</p>
      <Segment value={justify} options={justifyOptions} onChange={setJustify} />
      <p className="text-sm text-text-secondary">Select align:</p>
      <Segment value={align} options={alignOptions} onChange={setAlign} />
      <Flex justify={justify} align={align} className="h-[120px] w-full rounded-md border border-border-secondary">
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
      </Flex>
    </Flex>
  );
}
