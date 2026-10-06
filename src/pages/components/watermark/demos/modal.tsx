import * as React from "react";
import { Watermark } from "@/components/ui/watermark";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Watermark content={["KKUI", "Confidential"]}>
      <div className="rounded-lg border border-border-secondary bg-bg-container p-6">
        <h4 className="text-base font-semibold text-text-heading">Financial Quarterly Statement</h4>
        <p className="mt-2 text-sm text-text-secondary">
          The Modal below is rendered through a portal, outside this container. It still paints the
          same watermark because <code>inherit</code> is on by default.
        </p>
        <Button className="mt-4" type="primary" onClick={() => setOpen(true)}>
          Open protected modal
        </Button>
      </div>

      <Modal
        open={open}
        title="Q4 Revenue Detail"
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <p>Revenue surged by 24% YoY driven by cloud adoption and new developer product suites.</p>
        <p className="mt-2">Distribution of this document outside the finance team is prohibited.</p>
      </Modal>
    </Watermark>
  );
}
