import { DatePicker } from "@/components/ui/date-picker";

export default function ShowTimeDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DatePicker showTime />
    </div>
  );
}
