import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  return (
    <div className="space-y-4">
      <Segmented shape="round" options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]} />
      <Segmented shape="round" size="lg" options={["Map", "Transit", "Satellite"]} />
    </div>
  );
}
