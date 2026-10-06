import { useState } from "react";
import { InputNumber } from "@/components/ui/input-number";
import { Switch } from "@/components/ui/switch";

export default function Demo() {
  const [keyboard, setKeyboard] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <InputNumber min={1} max={10} keyboard={keyboard} defaultValue={3} className="w-40" />
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={keyboard} onChange={setKeyboard} /> Toggle keyboard
      </label>
    </div>
  );
}
