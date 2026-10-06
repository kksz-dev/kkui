import * as React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Explosive({ crash }: { crash: boolean }) {
  if (crash) throw new Error("Cannot read properties of undefined (reading 'hn')");
  return <p className="text-sm text-text-secondary">Patient summary rendered normally.</p>;
}

export default function BasicDemo() {
  const [crash, setCrash] = React.useState(false);

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setCrash(true)} disabled={crash}>
        Break this section
      </Button>

      <Card size="small" title="Summary">
        <ErrorBoundary
          showDetails
          resetKeys={[crash]}
          onError={(error) => console.log("reported:", error.message)}
          onReset={() => setCrash(false)}
        >
          <Explosive crash={crash} />
        </ErrorBoundary>
      </Card>

      <p className="text-xs text-text-tertiary">The rest of the page keeps working — only the card's content is replaced.</p>
    </div>
  );
}
