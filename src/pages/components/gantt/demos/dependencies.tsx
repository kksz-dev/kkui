import { Gantt, type GanttTask } from "@/components/ui/gantt";

const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const tasks: GanttTask[] = [
  { id: "phase-1", name: "Discovery", startDate: day(0), endDate: day(6), progress: 100, color: "success" },
  { id: "1a", name: "Stakeholder interviews", parentId: "phase-1", startDate: day(0), endDate: day(3), progress: 100, color: "success" },
  { id: "1b", name: "Requirements draft", parentId: "phase-1", startDate: day(3), endDate: day(6), progress: 100, color: "success" },
  { id: "phase-2", name: "Build", startDate: day(6), endDate: day(18), progress: 45, color: "primary" },
  { id: "2a", name: "Data model", parentId: "phase-2", startDate: day(6), endDate: day(11), progress: 80, dependencies: ["1b"], color: "primary" },
  { id: "2b", name: "API + UI", parentId: "phase-2", startDate: day(11), endDate: day(18), progress: 20, dependencies: ["2a"], color: "purple" },
  { id: "qa", name: "QA", startDate: day(18), endDate: day(23), progress: 0, dependencies: ["2b"], color: "warning" },
  { id: "launch", name: "Launch", startDate: day(24), endDate: day(24), milestone: true, color: "error" },
];

export default function DependenciesDemo() {
  return <Gantt tasks={tasks} showDependencies onTaskClick={(task) => console.log("clicked", task.name)} />;
}
