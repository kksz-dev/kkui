import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";

export default function ContainerDemo() {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-3">
      <Button onClick={() => setOpen((o) => !o)}>Toggle</Button>

      <div className="rounded-md border border-dashed border-border bg-fill-quaternary p-3">
        <p className="mb-2 text-xs text-text-tertiary">mount target</p>
        {/* the mount node stays a leaf: React owns either its text or the portal, not both */}
        <div ref={hostRef} className="relative min-h-8" />
      </div>

      {open && (
        <Portal container={() => hostRef.current}>
          <div className="rounded-sm bg-primary-bg px-2 py-1 text-xs text-primary">I live inside the dashed box</div>
        </Portal>
      )}
    </div>
  );
}
