import { StatCard } from "@/components/ui/stat-card";
import { Wallet, Users, Timer } from "lucide-react";

export default function FormattingDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title="Revenue"
        value={182450.5}
        precision={2}
        prefix="THB"
        icon={<Wallet className="size-5" />}
        trend={{ value: "12.4%", direction: "up", label: "vs last month" }}
      />
      <StatCard
        title="Active users"
        value={18420}
        formatter={(n) => `${(n / 1000).toFixed(1)}k`}
        icon={<Users className="size-5" />}
        sparklineData={[8, 12, 9, 15, 14, 19, 22, 21, 26]}
      />
      <StatCard
        title="Avg. response"
        value={"1.8"}
        suffix="s"
        precision={1}
        animate={false}
        icon={<Timer className="size-5" />}
        trend={{ value: "0.3s", direction: "down", label: "faster" }}
      />
    </div>
  );
}
