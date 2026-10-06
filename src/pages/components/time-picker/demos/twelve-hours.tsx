import dayjs from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TimePicker use12Hours defaultValue={dayjs("13:30:56", "HH:mm:ss")} />
      <TimePicker use12Hours format="h:mm A" placeholder="No seconds" />
      <TimePicker.RangePicker use12Hours format="h:mm A" />
    </div>
  );
}
