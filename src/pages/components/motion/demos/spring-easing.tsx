import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EASINGS = [
  { name: "spring", label: "Spring (k300 d25)", css: "var(--kk-ease-spring)" },
  { name: "spring-soft", label: "Soft (k220 d26)", css: "var(--kk-ease-spring-soft)" },
  { name: "spring-snap", label: "Snap (k420 d28)", css: "var(--kk-ease-spring-snap)" },
  { name: "ease-out", label: "ease-out (for contrast)", css: "var(--kk-ease-out)" },
];

export default function SpringEasingDemo() {
  const [run, setRun] = React.useState(0);

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setRun((n) => n + 1)}>
        Play
      </Button>

      <div className="space-y-3">
        {EASINGS.map((e) => (
          <Card key={e.name} size="small" className="overflow-hidden">
            <div className="mb-2 font-mono text-xs text-text-tertiary">{e.label}</div>
            <div className="relative h-8 rounded-full bg-fill-tertiary">
              <span
                key={`${e.name}-${run}`}
                className="absolute top-1 size-6 rounded-full bg-primary"
                style={{
                  animation: `kk-demo-slide 700ms ${e.css} both`,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <style>{`
        @keyframes kk-demo-slide {
          from { transform: translateX(4px); }
          to { transform: translateX(calc(100% + 100% - 2rem)); }
        }
      `}</style>
    </div>
  );
}
