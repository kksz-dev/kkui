import { useBreakpoint } from "@/components/ui/grid";

export default function Demo() {
  const screens = useBreakpoint();
  const active = Object.entries(screens).filter(([, v]) => v);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span>Current break point:</span>
      {active.map(([bp]) => (
        <span key={bp} className="rounded-sm border border-primary-border bg-primary-bg px-2 text-primary">
          {bp} <span className="text-success">✓</span>
        </span>
      ))}
    </div>
  );
}
