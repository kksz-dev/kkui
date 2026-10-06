import * as React from "react";
import { Statistic } from "@/components/ui/statistic";
import { Button } from "@/components/ui/button";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = display;
    const endVal = value;
    const duration = 1000;

    let rafId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out quint
      const ease = 1 - Math.pow(1 - progress, 5);
      setDisplay(Math.round(startVal + (endVal - startVal) * ease));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return <Statistic title="Total Revenue (USD)" value={display} prefix="$" />;
}

export default function Demo() {
  const [value, setValue] = React.useState(1234567);

  return (
    <div className="space-y-4">
      <AnimatedNumber value={value} />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setValue(Math.floor(Math.random() * 9000000) + 1000000)}>
          Randomize Value
        </Button>
        <Button size="sm" onClick={() => setValue(1234567)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
