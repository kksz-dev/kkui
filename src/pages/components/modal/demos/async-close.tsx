import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open async modal
      </Button>
      <Modal
        title="Saving takes 2 seconds"
        open={open}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        <p>The OK button spins while confirmLoading is true and Cancel is disabled.</p>
      </Modal>
    </>
  );
}
