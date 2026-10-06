import { useState } from "react";
import { Radio, RadioGroup, type RadioChangeEvent } from "@/components/ui/radio";

export default function Demo() {
  const [value, setValue] = useState<string | number | undefined>(1);
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <RadioGroup onChange={onChange} value={value}>
      <Radio value={1}>A</Radio>
      <Radio value={2}>B</Radio>
      <Radio value={3}>C</Radio>
      <Radio value={4}>D</Radio>
    </RadioGroup>
  );
}
