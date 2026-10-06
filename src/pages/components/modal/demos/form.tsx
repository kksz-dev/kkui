import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { message } from "@/components/ui/message";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [destroy, setDestroy] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="primary" onClick={() => setOpen(true)}>
        New project
      </Button>
      <Button onClick={() => setDestroy((v) => !v)}>
        destroyOnClose: {String(destroy)}
      </Button>

      <Modal
        title="New project"
        open={open}
        destroyOnClose={destroy}
        okText="Create"
        onOk={() => {
          message.success(`Created ${name || "untitled"}`);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      >
        <div className="space-y-3 py-1">
          <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <Input placeholder="Repository URL" />
          <p className="text-xs text-text-tertiary">
            With destroyOnClose the fields are unmounted on close, so they come back empty.
          </p>
        </div>
      </Modal>
    </div>
  );
}
