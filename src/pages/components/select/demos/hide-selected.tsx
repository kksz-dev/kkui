import { useState } from "react";
import { Select } from "@/components/ui/select";

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];

export default function Demo() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  return (
    <Select
      mode="multiple"
      placeholder="Inserted are removed"
      value={selectedItems}
      onChange={setSelectedItems}
      className="w-full"
      options={filteredOptions.map((item) => ({ value: item, label: item }))}
    />
  );
}
