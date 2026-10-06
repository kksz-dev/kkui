import * as React from "react";
import { Portal } from "@/components/ui/portal";

export default function OnMountDemo() {
  const [tag, setTag] = React.useState("");

  return (
    <div className="space-y-2">
      <Portal onMount={(node) => setTag(node.tagName.toLowerCase())}>
        <span className="hidden" />
      </Portal>
      <p className="text-sm text-text-secondary">
        Mounted into: <code>{tag || "…"}</code>
      </p>
    </div>
  );
}
