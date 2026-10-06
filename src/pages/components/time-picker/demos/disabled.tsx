import dayjs from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <TimePicker disabled defaultValue={dayjs("12:08:23", "HH:mm:ss")} />
      <TimePicker
        format="HH:mm"
        placeholder="Office hours only"
        disabledTime={() => ({
          disabledHours: () => [...Array(8).keys(), 18, 19, 20, 21, 22, 23],
          disabledMinutes: (hour) => (hour === 17 ? [30, 45] : []),
        })}
      />
      <TimePicker
        format="HH:mm"
        placeholder="Disabled options hidden"
        hideDisabledOptions
        disabledTime={() => ({ disabledHours: () => [...Array(8).keys(), 18, 19, 20, 21, 22, 23] })}
      />
    </div>
  );
}
