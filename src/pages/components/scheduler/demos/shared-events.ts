import type { SchedulerEvent } from "@/components/ui/scheduler";

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const sampleEvents: SchedulerEvent[] = [
  { id: "1", title: "Sprint Planning", startDate: day(0), startTime: "10:00", endTime: "11:30", color: "primary" },
  { id: "2", title: "Team Lunch", startDate: day(0), startTime: "12:30", endTime: "13:30", color: "success" },
  { id: "3", title: "Architecture Review", startDate: day(1), startTime: "15:00", endTime: "16:30", color: "purple" },
  { id: "4", title: "Release Freeze", startDate: day(2), endDate: day(4), color: "warning" },
  { id: "5", title: "Retro", startDate: day(3), startTime: "09:00", endTime: "10:00", color: "error" },
  { id: "6", title: "1:1 Reviews", startDate: day(-2), startTime: "14:00", endTime: "17:00", color: "primary" },
];
