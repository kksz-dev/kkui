import dayjs from "dayjs";
import { AlarmClock, Timer, Trash2 } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <TimePicker prefix={<AlarmClock className="size-3.5" />} format="HH:mm" placeholder="Wake up" />
      <TimePicker suffixIcon={<Timer className="size-4 text-text-quaternary" />} placeholder="Custom suffix" />
      <TimePicker
        allowClear={{ clearIcon: <Trash2 className="size-3.5" /> }}
        defaultValue={dayjs("07:45:00", "HH:mm:ss")}
        showNow={false}
      />
    </div>
  );
}
