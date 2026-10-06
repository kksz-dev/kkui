import { ShinyText } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <ShinyText text="Continuous metallic shimmer" className="text-xl font-bold" />
      <ShinyText text="Faster sweep (speed = 2s)" speed={2} className="text-xl font-bold" />
      <ShinyText
        text="Primary highlight"
        baseColor="var(--kk-primary-border)"
        shineColor="var(--kk-primary)"
        className="text-xl font-bold"
      />
      <ShinyText text="Animation disabled" disabled className="text-xl font-bold" />
    </div>
  );
}
