import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { BlurText } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  const replay = () => {
    setDone(false);
    setRun((n) => n + 1);
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div key={run} className="space-y-2">
        <BlurText
          text="Staggered blur reveal, word by word"
          delay={60}
          className="text-xl font-semibold text-text-heading"
          onAnimationComplete={() => setDone(true)}
        />
        <BlurText
          text="Letter by letter, rising from below"
          animateBy="letters"
          direction="bottom"
          delay={25}
          className="text-base text-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" icon={<RotateCcw />} onClick={replay}>
          Replay
        </Button>
        {done && (
          <span className="inline-flex items-center gap-1 text-xs text-success">
            <Check className="size-3" /> onAnimationComplete fired
          </span>
        )}
      </div>
    </div>
  );
}
