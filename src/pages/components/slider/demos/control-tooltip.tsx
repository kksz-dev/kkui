import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function Demo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6 pt-6">
      <Slider tooltip={{ open, placement: "bottom" }} defaultValue={30} />
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Tooltip open:</span>
        <Switch size="small" checked={open} onChange={setOpen} />
      </div>
    </div>
  );
}
