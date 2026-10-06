import { RadioGroup, Radio } from "@/components/ui/radio";

export default function Demo() {
  return (
    <RadioGroup name="radiogroup" defaultValue={1}>
      <Radio value={1}>A</Radio>
      <Radio value={2}>B</Radio>
      <Radio value={3}>C</Radio>
      <Radio value={4}>D</Radio>
    </RadioGroup>
  );
}
