import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function NestedPushDemo() {
  const [outer, setOuter] = React.useState(false);
  const [inner, setInner] = React.useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOuter(true)}>
        Open parent drawer
      </Button>

      <Drawer open={outer} title="Parent" onClose={() => setOuter(false)}>
        <p className="mb-3 text-sm text-text-secondary">The parent slides aside when the child opens.</p>
        <Button size="sm" onClick={() => setInner(true)}>
          Open child drawer
        </Button>

        <Drawer open={inner} title="Child" onClose={() => setInner(false)}>
          <p className="text-sm text-text-secondary">Press Escape to close this one first.</p>
        </Drawer>
      </Drawer>
    </>
  );
}
