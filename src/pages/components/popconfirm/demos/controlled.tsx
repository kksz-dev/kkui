import * as React from "react";
import { Popconfirm } from "@/components/ui/popconfirm";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { message } from "@/components/ui/message";

export default function ControlledDemo() {
  const [open, setOpen] = React.useState(false);
  const [condition, setCondition] = React.useState(true);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(false);
      return;
    }
    if (condition) {
      setOpen(true);
    } else {
      message.info("Direct execution because condition is disabled");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch checked={condition} onChange={setCondition} />
        <span className="text-sm text-text-secondary">
          Whether to show Popconfirm: {condition ? "Enabled" : "Disabled (executes directly)"}
        </span>
      </div>
      <div>
        <Popconfirm
          title="Controlled execution"
          description="Are you sure to perform this action?"
          open={open}
          onOpenChange={handleOpenChange}
          onConfirm={() => {
            setOpen(false);
            message.success("Executed");
          }}
          onCancel={() => setOpen(false)}
        >
          <Button type="primary">Perform Action</Button>
        </Popconfirm>
      </div>
    </div>
  );
}
