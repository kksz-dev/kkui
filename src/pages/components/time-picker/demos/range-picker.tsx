import dayjs from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <TimePicker.RangePicker
        onChange={(times, timeStrings) => console.log(times, timeStrings)}
      />
      <TimePicker.RangePicker
        defaultValue={[dayjs("09:00:00", "HH:mm:ss"), dayjs("17:30:00", "HH:mm:ss")]}
        format="HH:mm"
      />
      <TimePicker.RangePicker order={false} format="HH:mm" placeholder={["From", "To"]} />
    </div>
  );
}
