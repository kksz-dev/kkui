import { ArrowDown, ArrowUp } from "lucide-react";
import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <InputNumber min={1} max={10} defaultValue={3} controls={false} className="w-40" />
      <InputNumber
        min={1}
        max={10}
        defaultValue={3}
        controls={{ upIcon: <ArrowUp />, downIcon: <ArrowDown /> }}
        className="w-40"
      />
    </div>
  );
}
