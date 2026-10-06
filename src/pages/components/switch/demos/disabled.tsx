import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [disabled, setDisabled] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Switch disabled={disabled} defaultChecked />
        <Switch disabled={disabled} />
      </div>
      <div>
        <Button type="primary" size="sm" onClick={() => setDisabled(!disabled)}>
          Toggle disabled
        </Button>
      </div>
    </div>
  );
}
