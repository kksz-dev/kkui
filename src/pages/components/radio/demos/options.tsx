import { useState } from "react";
import { RadioGroup, type RadioChangeEvent } from "@/components/ui/radio";

const plainOptions = ["Apple", "Pear", "Orange"];
const options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" },
];
const optionsWithDisabled = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange", disabled: true },
];

export default function Demo() {
  const [value1, setValue1] = useState<string | number | undefined>("Apple");
  const [value2, setValue2] = useState<string | number | undefined>("Apple");
  const [value3, setValue3] = useState<string | number | undefined>("Apple");
  const [value4, setValue4] = useState<string | number | undefined>("Apple");

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup options={plainOptions} onChange={(e: RadioChangeEvent) => setValue1(e.target.value)} value={value1} />
      <RadioGroup options={optionsWithDisabled} onChange={(e: RadioChangeEvent) => setValue2(e.target.value)} value={value2} />
      <RadioGroup options={options} onChange={(e: RadioChangeEvent) => setValue3(e.target.value)} value={value3} optionType="button" />
      <RadioGroup options={optionsWithDisabled} onChange={(e: RadioChangeEvent) => setValue4(e.target.value)} value={value4} optionType="button" buttonStyle="solid" />
    </div>
  );
}
