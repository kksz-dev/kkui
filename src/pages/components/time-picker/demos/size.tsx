import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <TimePicker size="lg" placeholder="Large" />
      <TimePicker placeholder="Medium (default)" />
      <TimePicker size="sm" placeholder="Small" />
    </div>
  );
}
