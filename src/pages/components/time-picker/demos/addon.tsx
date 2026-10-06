import { useState } from "react";
import dayjs from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <TimePicker
      open={open}
      onOpenChange={setOpen}
      placeholder="With extra footer"
      renderExtraFooter={() => (
        <div className="flex items-center justify-between gap-2">
          <span>Shift presets</span>
          <Button size="sm" type="link" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      )}
      cellRender={(value, info) => (info.type === "hour" && value === 12 ? <b>noon</b> : info.originNode)}
      defaultValue={dayjs("09:00:00", "HH:mm:ss")}
    />
  );
}
