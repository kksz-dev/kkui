import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [width, setWidth] = useState<number | string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setWidth(1000)}>width = 1000</Button>
      <Button onClick={() => setWidth("60%")}>width = 60%</Button>
      <Modal
        title={`Modal width: ${width}`}
        open={width !== null}
        width={width ?? 520}
        onOk={() => setWidth(null)}
        onCancel={() => setWidth(null)}
      >
        <p>Numbers are pixels, strings are used verbatim.</p>
      </Modal>
    </div>
  );
}
