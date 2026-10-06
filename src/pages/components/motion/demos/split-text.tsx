import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { SplitText } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col items-start gap-4">
      <div key={run} className="space-y-2">
        <SplitText text="Characters slide up" className="text-xl font-semibold text-text-heading" />
        <SplitText
          text="Or zoom in, one by one"
          delay={60}
          animationFrom={{ opacity: 0, transform: "scale(0.4)" }}
          animationTo={{ opacity: 1, transform: "scale(1)" }}
          easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
          className="text-xl font-semibold text-primary"
        />
      </div>
      <Button size="sm" icon={<RotateCcw />} onClick={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}
