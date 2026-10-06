import * as React from "react";
import { Spin } from "@/components/ui/spin";
import { Button } from "@/components/ui/button";

export default function PercentDemo() {
  const [percent, setPercent] = React.useState(30);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-8">
        <Spin percent={percent} />
        <Spin percent="auto" />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setPercent(Math.max(0, percent - 10))}>
          -10%
        </Button>
        <Button size="sm" onClick={() => setPercent(Math.min(100, percent + 10))}>
          +10%
        </Button>
      </div>
    </div>
  );
}
