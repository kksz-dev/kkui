import { useState } from "react";
import { CircleX } from "lucide-react";
import { AutoComplete } from "@/components/ui/auto-complete";

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) });

export default function Demo() {
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const getPanelValue = (searchText: string) => (!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);

  return (
    <div className="flex flex-col gap-3">
      <AutoComplete options={options} className="w-50" onSearch={(text) => setOptions(getPanelValue(text))} placeholder="UnClearable" allowClear={false} />
      <AutoComplete options={options} className="w-50" onSearch={(text) => setOptions(getPanelValue(text))} placeholder="Customized clear icon" allowClear={{ clearIcon: <CircleX /> }} />
    </div>
  );
}
