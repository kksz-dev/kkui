import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import dayjs, { type Dayjs } from "dayjs";

export default function MiniDemo() {
  const [value, setValue] = React.useState<Dayjs>(dayjs());

  return (
    <div className="space-y-3">
      <Calendar fullscreen={false} value={value} onChange={setValue} />
      <p className="text-xs text-text-tertiary">Selected: {value.format("YYYY-MM-DD")}</p>
    </div>
  );
}
