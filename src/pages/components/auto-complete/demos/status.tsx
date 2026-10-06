import { useState } from "react";
import { AutoComplete } from "@/components/ui/auto-complete";

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) });

export default function Demo() {
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [anotherOptions, setAnotherOptions] = useState<{ value: string }[]>([]);
  const getPanelValue = (searchText: string) => (!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);

  return (
    <div className="flex flex-col gap-3">
      <AutoComplete options={options} onSearch={(text) => setOptions(getPanelValue(text))} status="error" className="w-50" placeholder="error" />
      <AutoComplete options={anotherOptions} onSearch={(text) => setAnotherOptions(getPanelValue(text))} status="warning" className="w-50" placeholder="warning" />
    </div>
  );
}
