import { Badge } from "@/components/ui/badge";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Badge count={25} />
      <Badge count={4} className="[&_[data-slot=badge-indicator]]:bg-bg-container [&_[data-slot=badge-indicator]]:text-text [&_[data-slot=badge-indicator]]:shadow-[0_0_0_1px_var(--kk-border)]" />
      <Badge count={109} className="[&_[data-slot=badge-indicator]]:bg-success" />
    </div>
  );
}
