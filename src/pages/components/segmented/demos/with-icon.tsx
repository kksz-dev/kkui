import { Segmented } from "@/components/ui/segmented";
import { LayoutGrid, List, Kanban, Table } from "lucide-react";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs text-text-secondary">Icon only:</div>
        <Segmented
          options={[
            { value: "list", icon: <List className="size-4" />, title: "List view" },
            { value: "kanban", icon: <Kanban className="size-4" />, title: "Kanban view" },
            { value: "grid", icon: <LayoutGrid className="size-4" />, title: "Grid view" },
          ]}
        />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-secondary">Icon and label:</div>
        <Segmented
          options={[
            { label: "List", value: "list", icon: <List className="size-4" /> },
            { label: "Kanban", value: "kanban", icon: <Kanban className="size-4" /> },
            { label: "Table", value: "table", icon: <Table className="size-4" /> },
          ]}
        />
      </div>
    </div>
  );
}
