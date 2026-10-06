import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <InputNumber placeholder="Outlined" className="w-full" />
      <InputNumber placeholder="Filled" variant="filled" className="w-full" />
      <InputNumber placeholder="Borderless" variant="borderless" className="w-full" />
      <InputNumber placeholder="Underlined" variant="underlined" className="w-full" />
    </div>
  );
}
