import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { WaveText } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col items-start gap-4">
      <div key={run} className="space-y-2">
        <WaveText text="Wave in, then hover me" className="text-xl font-semibold text-text-heading" />
        <WaveText text="Slower wave" delay={0.12} className="text-xl font-semibold text-primary" />
      </div>
      <Button size="sm" icon={<RotateCcw />} onClick={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}
