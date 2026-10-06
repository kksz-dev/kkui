import { useState } from "react";
import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  const [value, setValue] = useState<number | null>(99);
  return (
    <div className="flex flex-col gap-3">
      <InputNumber min={1} max={10} value={value} onChange={setValue} className="w-40" />
      <div className="text-sm text-text-secondary">
        Type a value outside 1–10: text turns red while typing and is clamped on blur. Current: <code>{String(value)}</code>
      </div>
    </div>
  );
}
