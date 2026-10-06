import { useState } from "react";
import { AutoComplete } from "@/components/ui/auto-complete";

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) });

export default function Demo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [anotherOptions, setAnotherOptions] = useState<{ value: string }[]>([]);

  const getPanelValue = (searchText: string) => (!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);

  return (
    <div className="flex flex-col gap-3">
      <AutoComplete
        options={options}
        className="w-50"
        onSelect={(data) => console.log("onSelect", data)}
        onSearch={(text) => setOptions(getPanelValue(text))}
        placeholder="input here"
      />
      <AutoComplete
        value={value}
        options={anotherOptions}
        className="w-50"
        onSelect={(data) => console.log("onSelect", data)}
        onSearch={(text) => setAnotherOptions(getPanelValue(text))}
        onChange={setValue}
        placeholder="control mode"
      />
    </div>
  );
}
