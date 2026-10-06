import * as React from "react";
import { StatisticTimer } from "@/components/ui/statistic";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [startTime, setStartTime] = React.useState(() => Date.now());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <StatisticTimer
            type="countup"
            title="Elapsed Time (Count Up)"
            value={startTime}
            format="HH:mm:ss:SSS"
          />
        </div>
        <div>
          <StatisticTimer
            type="countdown"
            title="Target Countdown"
            value={startTime + 60000}
            format="mm:ss"
          />
        </div>
      </div>
      <Button size="sm" onClick={() => setStartTime(Date.now())}>
        Reset Timer
      </Button>
    </div>
  );
}
