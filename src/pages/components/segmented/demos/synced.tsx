import * as React from "react";
import { Segmented } from "@/components/ui/segmented";

export default function Demo() {
  const [value, setValue] = React.useState<string | number>("Weekly");

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs text-text-secondary">Segmented 1:</div>
        <Segmented
          value={value}
          onChange={setValue}
          options={["Daily", "Weekly", "Monthly"]}
        />
      </div>
      <div>
        <div className="mb-2 text-xs text-text-secondary">Segmented 2 (synced):</div>
        <Segmented
          value={value}
          onChange={setValue}
          options={["Daily", "Weekly", "Monthly"]}
        />
      </div>
    </div>
  );
}
