import { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [value, setValue] = useState<Dayjs | null>(dayjs("10:15:00", "HH:mm:ss"));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <TimePicker value={value} onChange={setValue} needConfirm={false} />
        <Button size="sm" onClick={() => setValue(dayjs())}>
          Set to now
        </Button>
        <Button size="sm" onClick={() => setValue(null)}>
          Clear
        </Button>
      </div>
      <div className="text-sm text-text-secondary">
        Value: <strong className="text-text">{value ? value.format("HH:mm:ss") : "null"}</strong>
      </div>
    </div>
  );
}
