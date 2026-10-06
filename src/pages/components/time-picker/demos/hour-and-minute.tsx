import dayjs from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TimePicker defaultValue={dayjs("12:08", "HH:mm")} format="HH:mm" />
      <TimePicker defaultValue={dayjs("08:23", "mm:ss")} format="mm:ss" />
      <TimePicker showHour showMinute={false} showSecond={false} placeholder="Hour only" />
    </div>
  );
}
