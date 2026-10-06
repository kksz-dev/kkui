import { Scheduler, type SchedulerEvent } from "@/components/ui/scheduler";

const events: SchedulerEvent[] = [
  {
    id: "1",
    title: "Sprint Planning",
    startDate: new Date().toISOString().slice(0, 10),
    startTime: "10:00",
    color: "primary",
  },
  {
    id: "2",
    title: "Team Lunch & Retro",
    startDate: new Date().toISOString().slice(0, 10),
    startTime: "12:30",
    color: "success",
  },
  {
    id: "3",
    title: "Architecture Review",
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    startTime: "15:00",
    color: "purple",
  },
];

export default function Basic() {
  return <Scheduler events={events} defaultView="month" />;
}
