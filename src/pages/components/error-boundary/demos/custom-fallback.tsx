import * as React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

function Chart({ crash }: { crash: boolean }) {
  if (crash) throw new Error("series[0] is not iterable");
  return <div className="flex h-24 items-center justify-center text-sm text-text-secondary">Chart</div>;
}

export default function CustomFallbackDemo() {
  // starts healthy: a demo that throws on mount would log on every page load
  const [crash, setCrash] = React.useState(false);

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setCrash((c) => !c)}>
        {crash ? "Fix the data" : "Break the chart"}
      </Button>

      <ErrorBoundary
        resetKeys={[crash]}
        fallback={({ error, reset }) => (
          <Empty
            description={
              <span className="text-sm">
                Chart unavailable
                <span className="mt-1 block font-mono text-xs text-text-tertiary">{error.message}</span>
              </span>
            }
          >
            <Button size="sm" type="primary" onClick={reset}>
              Retry
            </Button>
          </Empty>
        )}
      >
        <Chart crash={crash} />
      </ErrorBoundary>
    </div>
  );
}
