import * as React from "react";
import { Gantt, type GanttTask } from "@/components/ui/gantt";

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function EditableDemo() {
  const [tasks, setTasks] = React.useState<GanttTask[]>([
    { id: "1", name: "Drag me sideways", startDate: day(1), endDate: day(5), progress: 60, color: "primary" },
    { id: "2", name: "Resize from either edge", startDate: day(4), endDate: day(10), progress: 30, color: "purple" },
  ]);

  return (
    <Gantt
      tasks={tasks}
      editable
      onTaskChange={(task, next) => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...next } : t)))}
    />
  );
}
