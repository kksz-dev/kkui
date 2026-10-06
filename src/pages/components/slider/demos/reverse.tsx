import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function Demo() {
  const [reverse, setReverse] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <Slider defaultValue={30} reverse={reverse} />
      <Slider range defaultValue={[20, 50]} reverse={reverse} />
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Reverse:</span>
        <Switch size="small" checked={reverse} onChange={setReverse} />
      </div>
    </div>
  );
}
