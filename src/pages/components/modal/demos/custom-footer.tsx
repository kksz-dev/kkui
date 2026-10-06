import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState<"render" | "none" | null>(null);
  const close = () => setOpen(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setOpen("render")}>Footer render prop</Button>
      <Button onClick={() => setOpen("none")}>No footer</Button>

      <Modal
        title="Custom footer"
        open={open === "render"}
        onCancel={close}
        onOk={close}
        footer={({ OkBtn, CancelBtn }) => (
          <>
            <Button type="link" onClick={() => window.open("https://kkui.kksz.dev", "_blank")}>
              Docs
            </Button>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <p>The render prop receives the default OK / Cancel buttons.</p>
      </Modal>

      <Modal title="Footer = null" open={open === "none"} onCancel={close} footer={null}>
        <p>No footer at all — close it with ✕, the mask or Escape.</p>
      </Modal>
    </div>
  );
}
