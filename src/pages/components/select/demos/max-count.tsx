import { useState } from "react";
import { Select } from "@/components/ui/select";

const MAX_COUNT = 3;

export default function Demo() {
  const [value, setValue] = useState<string[]>(["Ava Swift"]);
  const suffix = (
    <span className="text-xs">
      {value.length} / {MAX_COUNT}
    </span>
  );

  return (
    <Select
      mode="multiple"
      maxCount={MAX_COUNT}
      value={value}
      className="w-full"
      onChange={setValue}
      suffixIcon={suffix}
      placeholder="Please select"
      options={[
        { value: "Ava Swift", label: "Ava Swift" },
        { value: "Cole Reed", label: "Cole Reed" },
        { value: "Mia Blake", label: "Mia Blake" },
        { value: "Jake Stone", label: "Jake Stone" },
        { value: "Lily Lane", label: "Lily Lane" },
        { value: "Ryan Chase", label: "Ryan Chase" },
        { value: "Zoe Fox", label: "Zoe Fox" },
      ]}
    />
  );
}
