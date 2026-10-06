import { DatePicker } from "@/components/ui/date-picker";

const { MonthPicker, YearPicker, QuarterPicker, WeekPicker } = DatePicker;

export default function PickersDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <MonthPicker placeholder="Select month" />
      <YearPicker placeholder="Select year" />
      <QuarterPicker placeholder="Select quarter" />
      <WeekPicker placeholder="Select week" />
    </div>
  );
}
