import { useState } from "react";
import { AutoComplete } from "@/components/ui/auto-complete";

export default function Demo() {
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const handleSearch = (value: string) => {
    setOptions(() => {
      if (!value || value.includes("@")) return [];
      return ["gmail.com", "163.com", "qq.com"].map((domain) => ({ value: `${value}@${domain}` }));
    });
  };

  return (
    <AutoComplete
      className="w-50"
      onSearch={handleSearch}
      placeholder="input here"
      options={options}
      onSelect={(value) => console.log("onSelect", value)}
    />
  );
}
