import * as React from "react";
import { Spin } from "@/components/ui/spin";
import { Button } from "@/components/ui/button";

export default function Delay() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Spin spinning={loading} delay={500}>
        <div className="rounded-md border border-border-secondary bg-bg-container p-4 text-sm text-text">
          <p className="font-medium text-text-heading">Delayed Loading Container</p>
          <p className="mt-1 text-text-secondary">
            Setting delay prevents spinner flicker for fast operations (&lt; 500ms).
          </p>
        </div>
      </Spin>
      <div>
        <Button onClick={() => setLoading(!loading)}>
          Toggle Loading (500ms Delay)
        </Button>
      </div>
    </div>
  );
}
