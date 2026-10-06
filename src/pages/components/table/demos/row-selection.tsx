import * as React from "react";
import { Table, type ColumnType, type TableRowSelection } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Age", dataIndex: "age", width: 100 },
  { title: "Address", dataIndex: "address" },
];

const data: DataType[] = Array.from({ length: 12 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

export default function RowSelectionDemo() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [type, setType] = React.useState<"checkbox" | "radio">("checkbox");

  const rowSelection: TableRowSelection<DataType> = {
    type,
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    // Built-in "select all data / invert / clear" menu next to the header checkbox.
    selections: true,
    getCheckboxProps: (record) => ({ disabled: record.name === "Edward King 3" }),
    onSelect: (record, selected) => console.log("onSelect", record.name, selected),
    onSelectAll: (selected, _rows, changeRows) =>
      console.log("onSelectAll", selected, changeRows.length),
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          size="sm"
          value={type}
          options={[
            { label: "Checkbox", value: "checkbox" },
            { label: "Radio", value: "radio" },
          ]}
          onChange={(v) => {
            setType(v as typeof type);
            setSelectedRowKeys([]);
          }}
        />
        <Button size="sm" onClick={() => setSelectedRowKeys([0, 1])}>
          Select first two
        </Button>
        <Button size="sm" type="text" onClick={() => setSelectedRowKeys([])}>
          Clear
        </Button>
        <span className="text-xs text-text-secondary">Selected: {selectedRowKeys.length} items</span>
      </div>

      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
