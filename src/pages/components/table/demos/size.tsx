import * as React from "react";
import { Table, type ColumnType, type TableSize } from "@/components/ui/table";
import { Segmented } from "@/components/ui/segmented";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age", width: 100 },
  { title: "Address", dataIndex: "address", key: "address" },
];

const data: DataType[] = [
  { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
];

export default function SizeDemo() {
  const [size, setSize] = React.useState<TableSize>("md");

  return (
    <div className="space-y-3">
      <Segmented
        size="sm"
        value={size}
        options={[
          { label: "Small", value: "sm" },
          { label: "Middle", value: "md" },
          { label: "Large", value: "lg" },
        ]}
        onChange={(v) => setSize(v as TableSize)}
      />
      <Table columns={columns} dataSource={data} size={size} pagination={false} bordered />
    </div>
  );
}
