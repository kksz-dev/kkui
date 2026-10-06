import { Settings } from "lucide-react";
import { InputNumber } from "@/components/ui/input-number";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <InputNumber addonBefore="+" addonAfter="$" defaultValue={100} />
      <InputNumber
        addonBefore={
          <select className="bg-transparent outline-none" defaultValue="add">
            <option value="add">+</option>
            <option value="minus">-</option>
          </select>
        }
        addonAfter={
          <select className="bg-transparent outline-none" defaultValue="USD">
            <option value="USD">$</option>
            <option value="EUR">€</option>
            <option value="GBP">£</option>
            <option value="CNY">¥</option>
          </select>
        }
        defaultValue={100}
      />
      <InputNumber addonAfter={<Settings className="size-4" />} defaultValue={100} />
      <InputNumber addonBefore={<Settings className="size-4" />} defaultValue={100} />
      <InputNumber addonBefore="+" addonAfter="$" defaultValue={100} disabled />
    </div>
  );
}
