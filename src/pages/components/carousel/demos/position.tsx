import * as React from "react";
import { Carousel, type DotPosition } from "@/components/ui/carousel";
import { Radio, RadioGroup } from "@/components/ui/radio";

export default function PositionDemo() {
  const [position, setPosition] = React.useState<DotPosition>("bottom");

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">Dot Position:</span>
        <RadioGroup
          value={position}
          onChange={(e) => setPosition(e.target.value as DotPosition)}
          className="flex gap-4"
        >
          <Radio value="top">Top</Radio>
          <Radio value="bottom">Bottom</Radio>
          <Radio value="left">Left</Radio>
          <Radio value="right">Right</Radio>
        </RadioGroup>
      </div>

      <Carousel dotPosition={position}>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          1
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          2
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          3
        </div>
        <div className="flex h-40 items-center justify-center bg-[#364d79] text-white text-2xl font-semibold rounded-md">
          4
        </div>
      </Carousel>
    </div>
  );
}
