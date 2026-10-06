import { useState } from "react";
import { Select, type SelectOptionType, type SelectSize } from "@/components/ui/select";

const options: SelectOptionType[] = [];
for (let i = 10; i < 36; i++) {
  options.push({ value: i.toString(36) + i, label: i.toString(36) + i });
}

const handleChange = (value: string | string[]) => {
  console.log(`Selected: ${value}`);
};

export default function Demo() {
  const [size, setSize] = useState<SelectSize>("md");

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex rounded-md border border-border text-sm">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`px-4 py-1 first:rounded-l-md last:rounded-r-md ${size === s ? "bg-primary text-white" : "hover:text-primary"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Select size={size} defaultValue="a1" onChange={handleChange} className="w-50" options={options} />
        <Select mode="multiple" size={size} placeholder="Please select" defaultValue={["a10", "c12"]} onChange={handleChange} className="w-50" options={options} />
        <Select mode="tags" size={size} placeholder="Please select" defaultValue={["a10", "c12"]} onChange={handleChange} className="w-50" options={options} />
      </div>
    </div>
  );
}
