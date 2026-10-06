import { BorderBeam } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl border border-border bg-bg-container p-6">
        <BorderBeam />
        <h3 className="text-base font-semibold text-text-heading">Default beam</h3>
        <p className="mt-1 text-xs text-text-secondary">One light orbiting the border, 8s per lap.</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-bg-container p-6">
        <BorderBeam
          size={120}
          duration={4}
          borderWidth={2}
          colorFrom="var(--kk-error)"
          colorTo="var(--kk-warning)"
        />
        <h3 className="text-base font-semibold text-text-heading">Short, fast, warm</h3>
        <p className="mt-1 text-xs text-text-secondary">size 120, duration 4s, thicker border.</p>
      </div>
    </div>
  );
}
