import { useState } from "react";
import { InputNumber } from "@/components/ui/input-number";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <InputNumber min={1} max={10} disabled={disabled} defaultValue={3} className="w-40" />
        <InputNumber min={1} max={10} readOnly defaultValue={5} className="w-40" />
      </div>
      <div>
        <Button type="primary" onClick={() => setDisabled((d) => !d)}>
          Toggle disabled
        </Button>
      </div>
    </div>
  );
}
