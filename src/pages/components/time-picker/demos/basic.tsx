import dayjs from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TimePicker onChange={(time, timeString) => console.log(time, timeString)} />
      <TimePicker defaultValue={dayjs("13:30:56", "HH:mm:ss")} />
    </div>
  );
}
