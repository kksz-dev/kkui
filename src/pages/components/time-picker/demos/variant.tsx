import { TimePicker } from "@/components/ui/time-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <TimePicker variant="outlined" placeholder="Outlined" />
      <TimePicker variant="filled" placeholder="Filled" />
      <TimePicker variant="borderless" placeholder="Borderless" />
      <TimePicker variant="underlined" placeholder="Underlined" />
    </div>
  );
}
