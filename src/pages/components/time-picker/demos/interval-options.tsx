import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <TimePicker minuteStep={15} secondStep={10} hourStep={1} placeholder="Every 15 minutes" />
      <TimePicker format="HH:mm" minuteStep={30} changeOnScroll placeholder="Scroll to select" />
    </div>
  );
}
