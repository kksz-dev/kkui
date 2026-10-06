import * as React from "react";
import { Watermark } from "@/components/ui/watermark";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [open, setOpen] = React.useState(false);
  const [inherit, setInherit] = React.useState(true);

  return (
    <Watermark
      content="KKUI Serif Italic"
      inherit={inherit}
      font={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
    >
      <div className="rounded-lg border border-border-secondary bg-bg-container p-6">
        <h4 className="text-base font-semibold text-text-heading">Inherit into popup surfaces</h4>
        <p className="mt-2 text-sm text-text-secondary">
          With <code>inherit</code> on, the Drawer panel repaints the same watermark tile. Turn it
          off and only this container keeps the watermark.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="primary" onClick={() => setOpen(true)}>
            Open drawer
          </Button>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={inherit}
              onChange={(e) => setInherit(e.target.checked)}
            />
            inherit
          </label>
        </div>
      </div>

      <Drawer open={open} title="Employee Record" onClose={() => setOpen(false)}>
        <p>Name: Somchai Jaidee</p>
        <p className="mt-1">Department: Platform Engineering</p>
        <p className="mt-4 text-text-tertiary">
          The watermark on this panel comes from the Watermark wrapping the page.
        </p>
      </Drawer>
    </Watermark>
  );
}
