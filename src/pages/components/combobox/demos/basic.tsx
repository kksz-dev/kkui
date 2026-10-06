import * as React from "react";
import { Combobox } from "@/components/ui/combobox";

const options = [
  { value: "th", label: "Thailand", group: "APAC", description: "+66" },
  { value: "jp", label: "Japan", group: "APAC", description: "+81" },
  { value: "sg", label: "Singapore", group: "APAC", description: "+65" },
  { value: "de", label: "Germany", group: "EMEA", description: "+49" },
  { value: "fr", label: "France", group: "EMEA", description: "+33" },
  { value: "br", label: "Brazil", group: "LATAM", description: "+55", disabled: true },
];

export default function BasicDemo() {
  const [value, setValue] = React.useState<string | null>("th");

  return (
    <div className="max-w-72 space-y-2">
      <Combobox options={options} value={value} onChange={setValue} allowClear placeholder="Select a country" />
      <p className="text-xs text-text-tertiary">value: {value ?? "null"}</p>
    </div>
  );
}
