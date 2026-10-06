import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tooltip title="Shows on hover (default)">
        <Button>Hover</Button>
      </Tooltip>
      <Tooltip title="Shows while focused" trigger="focus">
        <Button>Focus</Button>
      </Tooltip>
      <Tooltip title="Toggle by clicking" trigger="click">
        <Button>Click</Button>
      </Tooltip>
      <Tooltip title="Slow enter (1s) / slow leave (0.5s)" mouseEnterDelay={1} mouseLeaveDelay={0.5}>
        <Button>Delayed</Button>
      </Tooltip>
      <Tooltip title="Controlled" open={open} onOpenChange={setOpen}>
        <Button type="primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide" : "Show"} controlled
        </Button>
      </Tooltip>
    </div>
  );
}
