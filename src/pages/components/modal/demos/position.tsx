import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState<"centered" | "top" | null>(null);
  const close = () => setOpen(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setOpen("centered")}>Centered</Button>
      <Button onClick={() => setOpen("top")}>Near the top</Button>

      <Modal title="Vertically centered" open={open === "centered"} centered onOk={close} onCancel={close}>
        <p>centered puts the dialog in the middle of the viewport.</p>
      </Modal>

      <Modal title="Custom offset" open={open === "top"} wrapClassName="pt-8" onOk={close} onCancel={close}>
        <p>wrapClassName styles the scrollable wrapper — here a smaller top padding.</p>
      </Modal>
    </div>
  );
}
