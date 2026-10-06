import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <InputNumber size="lg" min={1} max={100000} defaultValue={3} className="w-40" />
      <InputNumber min={1} max={100000} defaultValue={3} className="w-40" />
      <InputNumber size="sm" min={1} max={100000} defaultValue={3} className="w-40" />
    </div>
  );
}
