import { Segmented } from "@/components/ui/segmented";
import { LayoutGrid, List, Kanban } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex gap-8">
      <Segmented vertical options={["Daily", "Weekly", "Monthly", "Yearly"]} />
      <Segmented
        vertical
        options={[
          { label: "List View", value: "list", icon: <List className="size-4" /> },
          { label: "Kanban", value: "kanban", icon: <Kanban className="size-4" /> },
          { label: "Grid View", value: "grid", icon: <LayoutGrid className="size-4" /> },
        ]}
      />
    </div>
  );
}
