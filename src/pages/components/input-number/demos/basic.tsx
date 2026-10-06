import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  const onChange = (value: number | null) => console.log("changed", value);
  return <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} className="w-40" />;
}
