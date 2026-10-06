import * as React from "react";
import { Scheduler, type SchedulerEvent } from "@/components/ui/scheduler";
import { sampleEvents } from "./shared-events";

export default function EditableDemo() {
  // fully controlled: the component only asks, the page owns the list
  const [events, setEvents] = React.useState<SchedulerEvent[]>(sampleEvents);

  return (
    <Scheduler
      events={events}
      defaultView="month"
      onEventAdd={(event) => setEvents((prev) => [...prev, event])}
      onEventChange={(event) => setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))}
      onEventDelete={(event) => setEvents((prev) => prev.filter((e) => e.id !== event.id))}
    />
  );
}
