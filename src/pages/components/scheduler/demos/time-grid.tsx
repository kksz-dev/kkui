import { Scheduler } from "@/components/ui/scheduler";
import { sampleEvents } from "./shared-events";

export default function TimeGridDemo() {
  return <Scheduler events={sampleEvents} defaultView="week" hourRange={[8, 18]} editable={false} />;
}
