import { useState } from "react";
import { CircleHelp, MessageSquare, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative h-56 overflow-hidden rounded-lg border border-dashed border-border bg-bg-layout p-4">
      <Button onClick={() => setOpen((v) => !v)}>{open ? "Close menu" : "Open menu"}</Button>

      <FloatButton.Group
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        closeIcon={<Minus />}
        className="absolute right-4 bottom-4"
      >
        <FloatButton icon={<MessageSquare />} badge={{ dot: true }} />
        <FloatButton icon={<CircleHelp />} />
      </FloatButton.Group>
    </div>
  );
}
