import * as React from "react";
import { BarChart } from "@/components/ui/chart";
import { Segmented } from "@/components/ui/segmented";

const data = [
  { label: "Mon", accepted: 320, rejected: 24 },
  { label: "Tue", accepted: 410, rejected: 31 },
  { label: "Wed", accepted: 388, rejected: 18 },
  { label: "Thu", accepted: 452, rejected: 40 },
  { label: "Fri", accepted: 501, rejected: 22 },
];

export default function BarDemo() {
  const [mode, setMode] = React.useState("grouped");

  return (
    <div className="space-y-3">
      <Segmented
        size="sm"
        value={mode}
        onChange={(v) => setMode(String(v))}
        options={[
          { label: "Grouped", value: "grouped" },
          { label: "Stacked", value: "stacked" },
          { label: "Horizontal", value: "horizontal" },
        ]}
      />
      <BarChart
        data={data}
        series={[
          { key: "accepted", name: "Accepted" },
          { key: "rejected", name: "Rejected" },
        ]}
        ariaLabel="Accepted and rejected claims by weekday"
        stacked={mode === "stacked"}
        horizontal={mode === "horizontal"}
        height={mode === "horizontal" ? 240 : 220}
      />
    </div>
  );
}
