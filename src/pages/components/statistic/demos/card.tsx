import { Statistic } from "@/components/ui/statistic";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function Demo() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card bordered hoverable>
        <Statistic
          title="Active"
          value={11.28}
          precision={2}
          valueStyle={{ color: "var(--kk-success)" }}
          prefix={<ArrowUp className="size-4 text-success" />}
          suffix="%"
        />
      </Card>
      <Card bordered hoverable>
        <Statistic
          title="Idle"
          value={9.3}
          precision={2}
          valueStyle={{ color: "var(--kk-error)" }}
          prefix={<ArrowDown className="size-4 text-error" />}
          suffix="%"
        />
      </Card>
    </div>
  );
}
