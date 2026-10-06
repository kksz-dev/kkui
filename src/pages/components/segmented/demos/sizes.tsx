import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs text-text-secondary">Small (sm):</div>
        <Segmented size="sm" options={["Daily", "Weekly", "Monthly"]} />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-secondary">Medium (md - default):</div>
        <Segmented size="md" options={["Daily", "Weekly", "Monthly"]} />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-secondary">Large (lg):</div>
        <Segmented size="lg" options={["Daily", "Weekly", "Monthly"]} />
      </div>
    </div>
  );
}
