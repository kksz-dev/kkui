import { DatePicker } from "@/components/ui/date-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <DatePicker onChange={(d, s) => console.log(d, s)} />
      <DatePicker size="sm" placeholder="Small date" />
      <DatePicker size="lg" placeholder="Large date" />
    </div>
  );
}