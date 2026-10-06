import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";

export default function BasicDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Show"} portal content</Button>

      {open && (
        <Portal>
          <div className="fixed bottom-6 left-1/2 z-[1100] -translate-x-1/2 rounded-lg border border-border bg-bg-elevated px-4 py-2 text-sm shadow-kk">
            Rendered into document.body
          </div>
        </Portal>
      )}
    </>
  );
}
