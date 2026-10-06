import * as React from "react";
import { Drawer, type DrawerPlacement } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function PlacementDemo() {
  const [placement, setPlacement] = React.useState<DrawerPlacement | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(["top", "right", "bottom", "left"] as DrawerPlacement[]).map((p) => (
          <Button key={p} size="sm" onClick={() => setPlacement(p)}>
            {p}
          </Button>
        ))}
      </div>

      <Drawer
        open={placement !== null}
        placement={placement ?? "right"}
        title={`Placement: ${placement ?? ""}`}
        onClose={() => setPlacement(null)}
      >
        <p className="text-sm text-text-secondary">The panel slides in from the edge you picked.</p>
      </Drawer>
    </>
  );
}
