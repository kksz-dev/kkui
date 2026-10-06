import { Rocket } from "lucide-react";
import { MeteorCard } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <MeteorCard className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-bg text-purple">
          <Rocket className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">16 meteors</h3>
        <p className="text-xs text-text-secondary">Positions are derived from the index, so they never jump between renders.</p>
      </MeteorCard>

      <MeteorCard number={40} className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary-bg text-primary">
          <Rocket className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">40 meteors</h3>
        <p className="text-xs text-text-secondary">Denser shower via the number prop.</p>
      </MeteorCard>
    </div>
  );
}
