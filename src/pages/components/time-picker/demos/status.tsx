import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <TimePicker status="error" placeholder="Error" />
      <TimePicker status="warning" placeholder="Warning" />
      <TimePicker.RangePicker status="error" format="HH:mm" />
    </div>
  );
}
