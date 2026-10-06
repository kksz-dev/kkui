import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function LoadingDemo() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setLoading((v) => !v)}>
        Toggle loading
      </Button>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Orders today" value={1284} loading={loading} trend={{ value: "8%", direction: "up" }} />
        <StatCard title="Refunds" value={17} loading={loading} trend={{ value: "2", direction: "down" }} />
      </div>
    </div>
  );
}
