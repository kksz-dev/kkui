import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  return (
    <div className="w-full max-w-lg space-y-4">
      <Segmented block options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]} />
      <Segmented block options={["Long Label 1", "Long Label 2", "Long Label 3"]} />
    </div>
  );
}
