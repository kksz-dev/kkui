import * as React from "react";
import { AppBar } from "@/components/ui/app-bar";
import { Button } from "@/components/ui/button";

export default function TransparentDemo() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollTarget = React.useCallback(() => scrollRef.current!, []);

  return (
    <div ref={scrollRef} className="h-56 overflow-y-auto rounded-xl border border-border">
      <AppBar
        transparent
        bordered
        scrollTarget={scrollTarget}
        title="Scroll inside this box"
        actions={<Button size="sm" type="primary">Sign in</Button>}
      />
      <div className="-mt-14 bg-gradient-to-b from-primary-bg to-transparent p-6 pt-20 text-sm text-text-secondary">
        <p className="mb-3">The bar starts transparent and fills in once the page scrolls.</p>
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i} className="mb-3">
            Row {i + 1}
          </p>
        ))}
      </div>
    </div>
  );
}
