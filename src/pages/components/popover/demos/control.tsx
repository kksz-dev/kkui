import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      content={
        <button type="button" className="text-primary hover:text-primary-hover" onClick={() => setOpen(false)}>
          Close
        </button>
      }
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
    >
      <Button type="primary">Click me</Button>
    </Popover>
  );
}
