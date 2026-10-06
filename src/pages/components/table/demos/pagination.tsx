import * as React from "react";
import { Table, type ColumnType, type TablePaginationConfig } from "@/components/ui/table";
import { Segmented } from "@/components/ui/segmented";

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age", width: 100 },
  { title: "Address", dataIndex: "address", key: "address" },
];

const data: DataType[] = Array.from({ length: 46 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32 + (i % 9),
  address: `London, Park Lane no. ${i}`,
}));

export default function PaginationDemo() {
  const [position, setPosition] = React.useState<"bottomRight" | "bottomCenter" | "topRight">(
    "bottomRight",
  );

  const pagination: TablePaginationConfig = {
    position: [position],
    defaultPageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20],
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <div className="space-y-3">
      <Segmented
        size="sm"
        value={position}
        options={[
          { label: "bottomRight", value: "bottomRight" },
          { label: "bottomCenter", value: "bottomCenter" },
          { label: "topRight", value: "topRight" },
        ]}
        onChange={(v) => setPosition(v as typeof position)}
      />
      <Table columns={columns} dataSource={data} pagination={pagination} />
    </div>
  );
}
