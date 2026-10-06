import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function Demo() {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Slider defaultValue={30} disabled={disabled} />
      <Slider range defaultValue={[20, 50]} disabled={disabled} />
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Disabled:</span>
        <Switch size="small" checked={disabled} onChange={setDisabled} />
      </div>
    </div>
  );
}
