import { useState } from "react";
import { AutoComplete } from "@/components/ui/auto-complete";

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) });

export default function Demo() {
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const getPanelValue = (searchText: string) => (!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);

  return (
    <div className="flex flex-col gap-3">
      <AutoComplete options={options} onSearch={(text) => setOptions(getPanelValue(text))} className="w-50" placeholder="Outlined" />
      <AutoComplete options={options} onSearch={(text) => setOptions(getPanelValue(text))} variant="filled" className="w-50" placeholder="Filled" />
      <AutoComplete options={options} onSearch={(text) => setOptions(getPanelValue(text))} variant="borderless" className="w-50" placeholder="Borderless" />
      <AutoComplete options={options} onSearch={(text) => setOptions(getPanelValue(text))} variant="underlined" className="w-50" placeholder="Underlined" />
    </div>
  );
}
