import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";

export default function Basic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={128450}
        prefix="$"
        icon={<DollarSign className="size-5" />}
        trend={{ value: "18.2%", direction: "up", label: "vs last month" }}
        sparklineData={[10, 15, 12, 18, 24, 21, 29, 35]}
      />
      <StatCard
        title="Active Users"
        value={24890}
        icon={<Users className="size-5" />}
        trend={{ value: "5.4%", direction: "up", label: "vs last month" }}
        sparklineData={[40, 38, 42, 48, 52, 50, 60]}
      />
      <StatCard
        title="Conversion Rate"
        value="3.24%"
        icon={<Activity className="size-5" />}
        trend={{ value: "0.8%", direction: "down", label: "vs last week" }}
        sparklineData={[30, 28, 25, 27, 24, 22, 20]}
      />
      <StatCard
        title="New Orders"
        value={1420}
        icon={<ShoppingCart className="size-5" />}
        trend={{ value: "12.0%", direction: "up", label: "vs last week" }}
        sparklineData={[5, 8, 12, 10, 15, 18, 22]}
      />
    </div>
  );
}
