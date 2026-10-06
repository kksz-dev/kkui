import { useState } from "react";
import { Radio, RadioGroup, type RadioChangeEvent } from "@/components/ui/radio";

export default function Demo() {
  const [value, setValue] = useState<string | number | undefined>(1);
  return (
    <RadioGroup orientation="vertical" value={value} onChange={(e: RadioChangeEvent) => setValue(e.target.value)}>
      <Radio value={1}>Option A</Radio>
      <Radio value={2}>Option B</Radio>
      <Radio value={3}>Option C</Radio>
      <Radio value={4}>
        More...
        {value === 4 && (
          <input
            className="ml-2 h-control-sm w-24 rounded-sm border border-border bg-bg-container px-2 text-sm outline-none focus:border-primary"
            placeholder="please input"
          />
        )}
      </Radio>
    </RadioGroup>
  );
}
