import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function SizesLoadingDemo() {
  const [open, setOpen] = React.useState(false);
  const [large, setLarge] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const show = (isLarge: boolean) => {
    setLarge(isLarge);
    setLoading(true);
    setOpen(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => show(false)}>
          Default size
        </Button>
        <Button size="sm" onClick={() => show(true)}>
          Large size
        </Button>
      </div>

      <Drawer
        open={open}
        size={large ? "large" : "default"}
        loading={loading}
        title={large ? "Large drawer" : "Default drawer"}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        }
      >
        <p className="text-sm text-text-secondary">
          The body shows a skeleton while `loading` is true, then swaps in the real content.
        </p>
      </Drawer>
    </>
  );
}
