import { useState } from "react";
import { Cascader, type CascaderOption } from "@/components/ui/cascader";

const options = [
  { value: "zhejiang", label: "Zhejiang", children: [{ value: "hangzhou", label: "Hangzhou" }] },
  { value: "jiangsu", label: "Jiangsu", children: [{ value: "nanjing", label: "Nanjing" }] },
];

export default function Demo() {
  const [text, setText] = useState("Unselect");

  const onChange = (_value: (string | number)[], selectedOptions: CascaderOption[]) => {
    setText(selectedOptions.map((o) => o.label).join(", "));
  };

  return (
    <span className="text-sm">
      {text}
      &nbsp;
      <Cascader options={options} onChange={onChange}>
        <a className="cursor-pointer text-primary hover:text-primary-hover">Change city</a>
      </Cascader>
    </span>
  );
}
