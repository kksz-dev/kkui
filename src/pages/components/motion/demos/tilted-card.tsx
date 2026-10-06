import { Zap } from "lucide-react";
import { TiltedCard } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <TiltedCard className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary-bg text-primary">
          <Zap className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">Subtle tilt</h3>
        <p className="text-xs text-text-secondary">maxAngle 12, scale 1.02 (defaults).</p>
      </TiltedCard>

      <TiltedCard maxAngle={22} scale={1.06} perspective={700} className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-warning-bg text-warning">
          <Zap className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">Aggressive tilt</h3>
        <p className="text-xs text-text-secondary">maxAngle 22, scale 1.06, perspective 700.</p>
      </TiltedCard>
    </div>
  );
}
