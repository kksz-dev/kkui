import { useState } from "react";
import { Radio } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Radio defaultChecked={false} disabled={disabled}>Disabled</Radio>
        <Radio defaultChecked disabled={disabled}>Disabled</Radio>
      </div>
      <Button type="primary" size="sm" className="w-fit" onClick={() => setDisabled((d) => !d)}>
        Toggle disabled
      </Button>
    </div>
  );
}
