import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <InputNumber
        defaultValue={1000}
        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        className="w-40"
      />
      <InputNumber
        defaultValue={100}
        min={0}
        max={100}
        formatter={(value) => `${value}%`}
        parser={(value) => value.replace("%", "")}
        className="w-40"
      />
    </div>
  );
}
