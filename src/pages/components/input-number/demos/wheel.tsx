import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return <InputNumber min={1} max={10} defaultValue={3} changeOnWheel className="w-40" />;
}
