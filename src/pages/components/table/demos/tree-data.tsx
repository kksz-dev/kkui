import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age", width: 120 },
  { title: "Address", dataIndex: "address", key: "address" },
];

const data: DataType[] = [
  {
    key: "1",
    name: "Engineering Department",
    age: 60,
    address: "Building A",
    children: [
      {
        key: "11",
        name: "Frontend Squad",
        age: 42,
        address: "Floor 3",
        children: [
          { key: "111", name: "Alice Core Dev", age: 28, address: "Desk 301" },
          { key: "112", name: "Bob UI Engineer", age: 26, address: "Desk 302" },
        ],
      },
      {
        key: "12",
        name: "Backend Squad",
        age: 30,
        address: "Floor 4",
      },
    ],
  },
  {
    key: "2",
    name: "Design Department",
    age: 32,
    address: "Building B",
  },
];

export default function TreeDataDemo() {
  return <Table columns={columns} dataSource={data} />;
}
