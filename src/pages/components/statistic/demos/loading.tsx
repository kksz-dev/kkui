import * as React from "react";
import { Statistic } from "@/components/ui/statistic";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Statistic title="Active Users" value={112893} loading={loading} />
        <Statistic title="Total Revenue" value={98234} prefix="$" loading={loading} />
      </div>
      <Button size="sm" onClick={() => setLoading(!loading)}>
        Toggle Loading
      </Button>
    </div>
  );
}
