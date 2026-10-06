import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function DynamicDemo() {
  const [percent, setPercent] = React.useState(30);

  const increase = () => {
    setPercent((prev) => Math.min(100, prev + 10));
  };

  const decline = () => {
    setPercent((prev) => Math.max(0, prev - 10));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Progress percent={percent} />
        <div className="flex items-center gap-6">
          <Progress type="circle" percent={percent} />
          <Progress type="dashboard" percent={percent} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={decline}>
          -10%
        </Button>
        <Button size="sm" onClick={increase}>
          +10%
        </Button>
      </div>
    </div>
  );
}
