import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ChildrenDemo() {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-border-secondary bg-bg-container p-6">
        <Skeleton loading={loading} avatar active>
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              K
            </div>
            <div>
              <h4 className="font-semibold text-text-heading">KKUI Components</h4>
              <p className="mt-1 text-sm text-text-secondary">
                KKUI component catalog rebuilt on modern Tailwind CSS v4 and accessible KKUI primitives.
              </p>
            </div>
          </div>
        </Skeleton>
      </div>

      <div>
        <Button onClick={() => setLoading(!loading)}>
          Toggle Loading: {loading ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
