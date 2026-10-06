import * as React from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const options: ComboboxOption[] = [
  { value: "bkk", label: "Bangkok (BKK)" },
  { value: "cnx", label: "Chiang Mai (CNX)" },
  { value: "hkt", label: "Phuket (HKT)" },
];

export default function SizeStatusDemo() {
  const [val, setVal] = React.useState<string | null>("bkk");

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <Combobox size="sm" placeholder="Small size" options={options} value={val} onChange={setVal} />
      <Combobox size="md" placeholder="Default (Medium)" options={options} value={val} onChange={setVal} />
      <Combobox size="lg" placeholder="Large size" options={options} value={val} onChange={setVal} />
      <Combobox status="warning" placeholder="Warning status" options={options} />
      <Combobox status="error" placeholder="Error status" options={options} />
      <Combobox disabled placeholder="Disabled combobox" options={options} value="bkk" />
    </div>
  );
}
