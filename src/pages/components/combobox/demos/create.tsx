import * as React from "react";
import { Combobox } from "@/components/ui/combobox";

export default function CreateDemo() {
  const [options, setOptions] = React.useState([
    { value: "hypertension", label: "Hypertension" },
    { value: "diabetes", label: "Diabetes mellitus" },
    { value: "asthma", label: "Asthma" },
  ]);
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <div className="max-w-72 space-y-2">
      <Combobox
        options={options}
        value={value}
        onChange={setValue}
        allowCreate
        onCreate={(text) => setOptions((prev) => [...prev, { value: text, label: text }])}
        placeholder="Diagnosis"
        searchPlaceholder="Search or add…"
      />
      <p className="text-xs text-text-tertiary">Type something not on the list to add it.</p>
    </div>
  );
}
