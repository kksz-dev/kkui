import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <InputNumber min={0} max={10} step={0.1} defaultValue={0.3} className="w-40" />
      <InputNumber precision={2} step={0.01} defaultValue={3} className="w-40" />
      <InputNumber decimalSeparator="," step={0.5} defaultValue={2.5} className="w-40" />
    </div>
  );
}
