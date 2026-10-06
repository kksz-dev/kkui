import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function Demo() {
  const [value, setValue] = useState(30);
  const [committedValue, setCommittedValue] = useState(30);

  return (
    <div className="flex flex-col gap-4">
      <Slider
        value={value}
        onChange={setValue}
        onChangeComplete={setCommittedValue}
      />
      <div className="text-sm text-text-secondary">
        Current value: <strong className="text-text">{value}</strong> | Committed: <strong className="text-text">{committedValue}</strong>
      </div>
    </div>
  );
}
