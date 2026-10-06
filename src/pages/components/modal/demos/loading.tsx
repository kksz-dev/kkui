import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const show = () => {
    setLoading(true);
    setOpen(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <>
      <Button type="primary" onClick={show}>
        Open with skeleton
      </Button>
      <Modal
        title="Fetching the record"
        open={open}
        loading={loading}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        modalRender={(node) => <form onSubmit={(e) => e.preventDefault()}>{node}</form>}
      >
        <p>Loaded. modalRender wrapped this dialog in a &lt;form&gt; element.</p>
      </Modal>
    </>
  );
}
