import { useState } from "react";
import { Checkbox, type CheckboxChangeEvent } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const label = `${checked ? "Checked" : "Unchecked"}-${disabled ? "Disabled" : "Enabled"}`;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox checked={checked} disabled={disabled} onChange={(e: CheckboxChangeEvent) => setChecked(e.target.checked)}>
        {label}
      </Checkbox>
      <div className="flex gap-2">
        <Button type="primary" size="sm" onClick={() => setChecked((c) => !c)}>
          {!checked ? "Check" : "Uncheck"}
        </Button>
        <Button type="primary" size="sm" onClick={() => setDisabled((d) => !d)}>
          {!disabled ? "Disable" : "Enable"}
        </Button>
      </div>
    </div>
  );
}
