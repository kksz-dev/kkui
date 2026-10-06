import { Statistic } from "@/components/ui/statistic";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function Demo() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-border-secondary p-4 bg-bg-container">
        <Statistic
          title="Active Users"
          value={112893}
        />
      </div>
      <div className="rounded-lg border border-border-secondary p-4 bg-bg-container">
        <Statistic
          title="Account Balance (CNY)"
          value={112893}
          precision={2}
        />
      </div>
      <div className="rounded-lg border border-border-secondary p-4 bg-bg-container">
        <Statistic
          title="Feedback Rate"
          value={11.28}
          precision={2}
          valueStyle={{ color: "var(--kk-success)" }}
          prefix={<ArrowUp className="size-4 text-success" />}
          suffix="%"
        />
      </div>
      <div className="rounded-lg border border-border-secondary p-4 bg-bg-container">
        <Statistic
          title="Churn Rate"
          value={9.3}
          precision={2}
          valueStyle={{ color: "var(--kk-error)" }}
          prefix={<ArrowDown className="size-4 text-error" />}
          suffix="%"
        />
      </div>
    </div>
  );
}
