import { useState } from "react";
import { Cascader, type CascaderOption } from "@/components/ui/cascader";

interface Option extends CascaderOption {
  value: string;
  label: string;
  children?: Option[];
  isLeaf?: boolean;
}

const initial: Option[] = [
  { value: "zhejiang", label: "Zhejiang", isLeaf: false },
  { value: "jiangsu", label: "Jiangsu", isLeaf: false },
];

export default function Demo() {
  const [options, setOptions] = useState(initial);

  const loadData = (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // load options lazily
    setTimeout(() => {
      targetOption.children = [
        { label: `${targetOption.label} Dynamic 1`, value: "dynamic1" },
        { label: `${targetOption.label} Dynamic 2`, value: "dynamic2", isLeaf: false },
      ];
      setOptions((o) => [...o]);
    }, 600);
  };

  return <Cascader options={options} loadData={loadData} onChange={(v, so) => console.log(v, so)} changeOnSelect placeholder="Please select" />;
}
