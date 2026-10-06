import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        afterClose={() => console.log("closed")}
      >
        <p>Some contents in modal dialog…</p>
        <p>Escape, the mask and the ✕ all close it.</p>
      </Modal>
    </>
  );
}
