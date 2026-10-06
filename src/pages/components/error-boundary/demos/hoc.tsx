import * as React from "react";
import { withErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";

function UnstableWidget({ shouldFail }: { shouldFail?: boolean }) {
  if (shouldFail) {
    throw new Error("Critical chart loading failure inside HOC widget!");
  }
  return (
    <div className="p-4 rounded-lg bg-bg-container border border-border">
      <div className="font-semibold text-text-heading">Financial Metric Widget</div>
      <div className="text-2xl font-mono text-primary mt-2">฿ 1,450,200</div>
    </div>
  );
}

const SafeWidget = withErrorBoundary(UnstableWidget, {
  title: "Widget Crashed",
  description: "Failed to render this specific widget safely wrapped with HOC.",
});

export default function HOCDemo() {
  const [fail, setFail] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button danger={!fail} onClick={() => setFail(!fail)}>
        {fail ? "Reset & Fix Widget" : "Trigger HOC Widget Crash"}
      </Button>
      <SafeWidget shouldFail={fail} />
    </div>
  );
}
