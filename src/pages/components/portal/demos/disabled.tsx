import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { Switch } from "@/components/ui/switch";

export default function DisabledDemo() {
  const [inline, setInline] = React.useState(true);

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={inline} onChange={setInline} />
        render inline (disabled)
      </label>

      <div className="rounded-md border border-border p-3 text-xs text-text-tertiary">
        parent box
        <Portal disabled={inline}>
          <span className="ml-2 rounded-sm bg-primary-bg px-2 py-0.5 text-primary">content</span>
        </Portal>
      </div>
    </div>
  );
}
