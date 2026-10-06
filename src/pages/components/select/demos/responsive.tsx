import { useState } from "react";
import { Select, type SelectOptionType } from "@/components/ui/select";

const options: SelectOptionType[] = [];
for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.push({ label: `Long Label: ${value}`, value });
}

export default function Demo() {
  const [value, setValue] = useState(["a10", "c12", "h17", "j19", "k20"]);

  return (
    <div className="flex flex-col gap-2">
      <Select mode="multiple" maxTagCount="responsive" className="w-full" placeholder="Please select" value={value} onChange={setValue} options={options} />
      <Select mode="multiple" disabled maxTagCount="responsive" className="w-full" placeholder="Please select" value={value} onChange={setValue} options={options} />
      <Select mode="multiple" maxTagCount={2} className="w-full" placeholder="maxTagCount = 2" value={value} onChange={setValue} options={options} />
    </div>
  );
}
