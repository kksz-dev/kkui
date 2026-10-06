import { useState } from "react";
import { Affix } from "@/components/ui/affix";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [top, setTop] = useState(10);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">
        Toggle the offset while the element is affixed to see it re-measure without leaving the flow.
      </p>
      <Affix offsetTop={top}>
        <div className="inline-flex items-center gap-3 rounded-md border border-border bg-bg-elevated px-3 py-2 shadow-kk-tertiary">
          <span className="text-sm">offsetTop = {top}px</span>
          <Button size="sm" onClick={() => setTop((t) => (t >= 60 ? 10 : t + 10))}>
            +10
          </Button>
        </div>
      </Affix>
    </div>
  );
}
