import { GradientText } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <GradientText className="text-2xl font-black">Flowing token gradient</GradientText>

      <GradientText
        colors={["var(--kk-primary)", "var(--kk-primary-hover)", "var(--kk-primary)"]}
        animationSpeed={3}
        className="text-2xl font-black"
      >
        Custom colors, faster
      </GradientText>

      <GradientText showBorder className="text-sm font-semibold">
        With gradient border
      </GradientText>
    </div>
  );
}
