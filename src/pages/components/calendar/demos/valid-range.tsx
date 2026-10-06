import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";

export default function ValidRangeDemo() {
  const start = dayjs().startOf("month").add(4, "day");
  const end = dayjs().startOf("month").add(20, "day");

  return (
    <Calendar
      fullscreen={false}
      validRange={[start, end]}
      defaultValue={start}
      headerRender={({ value, onChange }) => (
        <div className="flex items-center justify-between pb-3">
          <span className="text-sm font-semibold text-text-heading">{value.format("MMMM YYYY")}</span>
          <button
            type="button"
            onClick={() => onChange(dayjs())}
            className="text-xs font-medium text-primary hover:underline"
          >
            This month
          </button>
        </div>
      )}
    />
  );
}
