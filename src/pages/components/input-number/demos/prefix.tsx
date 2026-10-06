import { User } from "lucide-react";
import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <InputNumber prefix="￥" className="w-full" />
      <InputNumber addonBefore="+" prefix="￥" className="w-full" />
      <InputNumber prefix="$" suffix="USD" className="w-full" />
      <InputNumber prefix={<User />} suffix="pcs" disabled className="w-full" />
    </div>
  );
}
