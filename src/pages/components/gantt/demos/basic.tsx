import { Gantt, type GanttTask } from "@/components/ui/gantt";

const today = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
};

const tasks: GanttTask[] = [
  { id: "1", name: "Requirements & Scoping", startDate: formatDate(0), endDate: formatDate(4), progress: 100, color: "success" },
  { id: "2", name: "UI/UX Prototype", startDate: formatDate(3), endDate: formatDate(8), progress: 75, color: "primary" },
  { id: "3", name: "Core Engine Implementation", startDate: formatDate(7), endDate: formatDate(16), progress: 40, color: "purple" },
  { id: "4", name: "QA & Integration Testing", startDate: formatDate(15), endDate: formatDate(22), progress: 10, color: "warning" },
];

export default function Basic() {
  return <Gantt tasks={tasks} totalDays={25} />;
}
