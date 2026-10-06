import * as React from "react";
import { Spin } from "@/components/ui/spin";
import { Button } from "@/components/ui/button";

export default function Inside() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Spin spinning={loading}>
        <div className="rounded-md border border-info-border bg-info-bg p-4 text-sm text-text">
          <p className="font-medium text-text-heading">Notification Box</p>
          <p className="mt-1 text-text-secondary">
            Progress and loading details can be rendered inside container elements.
          </p>
        </div>
      </Spin>
      <div>
        <Button onClick={() => setLoading(!loading)}>
          Toggle Loading: {loading ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
