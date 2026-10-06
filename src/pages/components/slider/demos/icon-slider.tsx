import { useState } from "react";
import { Volume1, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const MIN = 0;
const MAX = 100;

export default function Demo() {
  const [value, setValue] = useState(30);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="mute"
        onClick={() => setValue(MIN)}
        className={cn("kk-press rounded-sm p-1", value === MIN ? "text-primary" : "text-text-tertiary")}
      >
        <Volume1 className="size-4" />
      </button>
      <div className="flex-1">
        <Slider min={MIN} max={MAX} value={value} onChange={setValue} />
      </div>
      <button
        type="button"
        aria-label="max volume"
        onClick={() => setValue(MAX)}
        className={cn("kk-press rounded-sm p-1", value === MAX ? "text-primary" : "text-text-tertiary")}
      >
        <Volume2 className="size-4" />
      </button>
    </div>
  );
}
