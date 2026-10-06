import { Sparkline } from "@/components/ui/chart";
import { StatCard } from "@/components/ui/stat-card";

const series = [12, 18, 14, 22, 26, 21, 30, 28, 35];

export default function SparklineDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Sparkline data={series} ariaLabel="Rising visit trend" />
        <Sparkline data={[...series].reverse()} ariaLabel="Falling visit trend" color="var(--kk-chart-3)" />
        <Sparkline data={series} ariaLabel="Visit trend without area fill" area={false} color="var(--kk-chart-4)" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Visits this week" value={2418} sparklineData={series} trend={{ value: "8.2%", direction: "up" }} />
        <StatCard title="Average wait" value={17} suffix="min" sparklineData={[...series].reverse()} trend={{ value: "3 min", direction: "down" }} />
      </div>
    </div>
  );
}
