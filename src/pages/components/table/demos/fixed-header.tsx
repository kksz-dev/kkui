import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age", width: 120 },
  { title: "Address", dataIndex: "address", key: "address" },
];

const data: DataType[] = Array.from({ length: 60 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32 + (i % 5),
  address: `London, Park Lane no. ${i}`,
}));

export default function FixedHeaderDemo() {
  return <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 260 }} />;
}
