import { AnimatedBadge } from "@/components/ui/motion";

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <AnimatedBadge>Live</AnimatedBadge>
        <AnimatedBadge color="success">Deployed</AnimatedBadge>
        <AnimatedBadge color="warning">Degraded</AnimatedBadge>
        <AnimatedBadge color="error">Incident</AnimatedBadge>
        <AnimatedBadge color="purple">Beta</AnimatedBadge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <AnimatedBadge ping={false}>No ping</AnimatedBadge>
        <AnimatedBadge color="success" ping={false} className="rounded-md">
          Square-ish
        </AnimatedBadge>
      </div>
    </div>
  );
}
