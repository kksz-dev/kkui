import { Clock } from "lucide-react";
import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <InputNumber status="error" className="w-full" />
      <InputNumber status="warning" className="w-full" />
      <InputNumber status="error" prefix={<Clock />} className="w-full" />
      <InputNumber status="warning" prefix={<Clock />} className="w-full" />
    </div>
  );
}
