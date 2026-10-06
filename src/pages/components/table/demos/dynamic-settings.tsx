import * as React from "react";
import { Table, type ColumnType, type TableSize } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Segmented } from "@/components/ui/segmented";

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const data: DataType[] = Array.from({ length: 12 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32 + (i % 6),
  address: `London, Park Lane no. ${i}`,
  description: `Detail panel for Edward King ${i}: joined in 20${10 + i}, works on the platform team.`,
}));

export default function DynamicSettingsDemo() {
  const [bordered, setBordered] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [showTitle, setShowTitle] = React.useState(true);
  const [showFooter, setShowFooter] = React.useState(true);
  const [rowSelection, setRowSelection] = React.useState(true);
  const [expandable, setExpandable] = React.useState(false);
  const [showHeader, setShowHeader] = React.useState(true);
  const [ellipsis, setEllipsis] = React.useState(false);
  const [size, setSize] = React.useState<TableSize>("md");
  const [top, setTop] = React.useState(false);

  const columns: ColumnType<DataType>[] = [
    { title: "Name", dataIndex: "name", key: "name", ellipsis, sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Age", dataIndex: "age", key: "age", width: 100, sorter: (a, b) => a.age - b.age },
    { title: "Address", dataIndex: "address", key: "address", ellipsis },
  ];

  const toggles: [string, boolean, (v: boolean) => void][] = [
    ["Bordered", bordered, setBordered],
    ["Loading", loading, setLoading],
    ["Title", showTitle, setShowTitle],
    ["Footer", showFooter, setShowFooter],
    ["Checkbox", rowSelection, setRowSelection],
    ["Expandable", expandable, setExpandable],
    ["Header", showHeader, setShowHeader],
    ["Ellipsis", ellipsis, setEllipsis],
    ["Pagination on top", top, setTop],
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border-secondary bg-bg-layout p-3">
        {toggles.map(([label, value, set]) => (
          <Checkbox key={label} checked={value} onChange={(e) => set(e.target.checked)}>
            <span className="text-xs">{label}</span>
          </Checkbox>
        ))}
        <Segmented
          size="sm"
          value={size}
          options={[
            { label: "sm", value: "sm" },
            { label: "md", value: "md" },
            { label: "lg", value: "lg" },
          ]}
          onChange={(v) => setSize(v as TableSize)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        size={size}
        bordered={bordered}
        loading={loading}
        showHeader={showHeader}
        rowSelection={rowSelection ? { selections: true } : undefined}
        expandable={
          expandable
            ? {
                expandedRowRender: (record) => (
                  <p className="m-0 text-xs text-text-secondary">{record.description}</p>
                ),
              }
            : undefined
        }
        title={showTitle ? () => "Header of the table" : undefined}
        footer={showFooter ? () => "Footer of the table" : undefined}
        pagination={{ pageSize: 5, position: [top ? "topRight" : "bottomRight"] }}
        rowClassName={(_, index) => (index % 2 === 1 ? "bg-fill-quaternary/40" : "")}
      />
    </div>
  );
}
