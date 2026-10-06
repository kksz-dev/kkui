import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function Demo() {
  const [value, setValue] = useState<number[]>([20, 50]);

  return (
    <div className="flex flex-col gap-4">
      <Slider range={{ draggableTrack: true }} value={value} onChange={setValue} />
      <Slider range={{ draggableTrack: true }} defaultValue={[10, 30, 60]} />
      <div className="text-sm text-text-secondary">
        Range: <strong className="text-text">{value.join(" – ")}</strong>
      </div>
    </div>
  );
}
