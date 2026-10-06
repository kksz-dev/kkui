import { useState } from "react";
import { AutoComplete } from "@/components/ui/auto-complete";
import { InputTextArea } from "@/components/ui/input";

export default function Demo() {
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const handleSearch = (value: string) => {
    setOptions(!value ? [] : [{ value }, { value: value + value }, { value: value + value + value }]);
  };

  const handleKeyPress = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log("handleKeyPress", ev);
  };

  return (
    <AutoComplete options={options} className="w-50" onSelect={(v) => console.log("onSelect", v)} onSearch={handleSearch}>
      <InputTextArea placeholder="input here" className="h-12" onKeyDown={handleKeyPress} />
    </AutoComplete>
  );
}
