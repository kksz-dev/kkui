import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name", width: 140, ellipsis: true },
  { title: "Age", dataIndex: "age", key: "age", width: 80 },
  {
    title: "Address (tooltip on hover)",
    dataIndex: "address",
    key: "address",
    ellipsis: true,
  },
  {
    title: "Tags (no title attribute)",
    dataIndex: "tags",
    key: "tags",
    ellipsis: { showTitle: false },
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown with a very long name that will not fit",
    age: 32,
    address: "New York No. 1 Lake Park, New York No. 1 Lake Park, New York No. 1 Lake Park",
    tags: "frontend, design-system, accessibility, performance, testing",
  },
  {
    key: "2",
    name: "Jim Green also has a rather long name here",
    age: 42,
    address: "London No. 2 Lake Park, London No. 2 Lake Park, London No. 2 Lake Park",
    tags: "backend, databases, observability, infrastructure",
  },
];

export default function EllipsisDemo() {
  return <Table columns={columns} dataSource={data} bordered pagination={false} tableLayout="fixed" />;
}
