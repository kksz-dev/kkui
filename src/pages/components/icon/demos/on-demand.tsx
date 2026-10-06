import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const SETS = [
  "solar:shield-check-bold",
  "tabler:sparkles",
  "mdi:rocket-launch-outline",
  "ph:butterfly-duotone",
];

export default function OnDemandDemo() {
  const [shown, setShown] = React.useState(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-5 text-3xl text-primary">
        {SETS.slice(0, shown).map((name) => (
          <Icon key={name} name={name} />
        ))}
      </div>

      <Button size="sm" disabled={shown >= SETS.length} onClick={() => setShown((n) => n + 1)}>
        Load one more icon
      </Button>

      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <Icon name="lucide:bell" size={20}>
          <Bell className="size-full" />
        </Icon>
        <span>
          A bundled icon passed as children is shown immediately and stays as the fallback if the
          lookup fails.
        </span>
      </div>
    </div>
  );
}
