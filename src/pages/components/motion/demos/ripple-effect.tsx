import { RippleEffect } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <RippleEffect className="rounded-lg border border-border bg-bg-container px-6 py-3">
        <span className="text-sm font-medium text-text">Click anywhere for a ripple</span>
      </RippleEffect>

      <RippleEffect
        color="var(--kk-success-bg-hover)"
        duration={1200}
        className="rounded-lg border border-success-border bg-success-bg px-6 py-3"
      >
        <span className="text-sm font-medium text-success">Slow green ripple (1200ms)</span>
      </RippleEffect>
    </div>
  );
}
