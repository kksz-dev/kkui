import { Scheduler } from "@/components/ui/scheduler";
import { sampleEvents } from "./shared-events";

export default function AgendaDemo() {
  return <Scheduler events={sampleEvents} defaultView="agenda" editable={false} />;
}
