import { Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <SpotlightCard className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary-bg text-primary">
          <Sparkles className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">Default spotlight</h3>
        <p className="text-xs text-text-secondary">Move the pointer across the card.</p>
      </SpotlightCard>

      <SpotlightCard spotlightColor="var(--kk-success-bg-hover)" className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-success-bg text-success">
          <Sparkles className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">Custom color</h3>
        <p className="text-xs text-text-secondary">Any CSS color works, tokens included.</p>
      </SpotlightCard>
    </div>
  );
}
