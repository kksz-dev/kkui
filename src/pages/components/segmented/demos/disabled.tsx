import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs text-text-secondary">Disabled segmented:</div>
        <Segmented disabled options={["Map", "Transit", "Satellite"]} />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-secondary">Disabled specific option:</div>
        <Segmented
          options={[
            { label: "Daily", value: "Daily" },
            { label: "Weekly", value: "Weekly", disabled: true },
            { label: "Monthly", value: "Monthly" },
          ]}
        />
      </div>
    </div>
  );
}
