import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
];

const data: DataType[] = [
  { key: 1, name: "John Brown", age: 32, address: "New York No. 1 Lake Park", description: "John is a senior backend engineer specializing in distributed systems and cloud infrastructure." },
  { key: 2, name: "Jim Green", age: 42, address: "London No. 1 Lake Park", description: "Jim manages UX design initiatives and cross-functional design system tokens." },
  { key: 3, name: "Not Expandable", age: 29, address: "Jiangsu No. 1 Lake Park", description: "This row is marked non-expandable." },
  { key: 4, name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park", description: "Joe oversees security compliance and microservices governance." },
];

export default function ExpandableDemo() {
  return (
    <Table
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <p className="text-xs text-text-secondary m-0">{record.description}</p>,
        rowExpandable: (record) => record.name !== "Not Expandable",
      }}
      dataSource={data}
    />
  );
}
