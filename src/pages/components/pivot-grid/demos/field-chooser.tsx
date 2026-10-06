import * as React from "react";
import { PivotGrid, type PivotGridField } from "@/components/ui/pivot-grid";

interface TicketRecord {
  team: string;
  priority: string;
  channel: string;
  hours: number;
}

const dataSource: TicketRecord[] = ["Platform", "Billing", "Mobile"].flatMap((team, ti) =>
  ["High", "Normal"].flatMap((priority, pi) =>
    ["Email", "Chat", "Phone"].map((channel, ci) => ({
      team,
      priority,
      channel,
      hours: 4 + ti * 3 + pi * 2 + ci,
    })),
  ),
);

const initialFields: PivotGridField<TicketRecord>[] = [
  { key: "team", caption: "Team", dataIndex: "team", area: "row" },
  { key: "priority", caption: "Priority", dataIndex: "priority", area: "column" },
  { key: "channel", caption: "Channel", dataIndex: "channel", area: "filter" },
  { key: "hours", caption: "Hours", dataIndex: "hours", area: "data", summaryType: "sum" },
];

export default function FieldChooserDemo() {
  const [fields, setFields] = React.useState(initialFields);
  const [drill, setDrill] = React.useState<string>("");

  return (
    <div className="space-y-3">
      <PivotGrid
        dataSource={dataSource}
        fields={fields}
        onFieldsChange={setFields}
        fieldChooser
        onCellClick={({ rowPath, columnPath, records }) =>
          setDrill(`${rowPath.join(" / ") || "all"} x ${columnPath.join(" / ") || "all"} - ${records.length} records`)
        }
      />
      <p className="text-xs text-text-tertiary">{drill || "Click a cell to drill down."}</p>
    </div>
  );
}
