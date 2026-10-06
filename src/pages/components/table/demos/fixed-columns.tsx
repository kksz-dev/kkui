import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  street: string;
  building: string;
  door: number;
  city: string;
  postcode: number;
}

const columns: ColumnType<DataType>[] = [
  { title: "Full Name", width: 140, dataIndex: "name", key: "name", fixed: "left" },
  { title: "Age", width: 100, dataIndex: "age", key: "age", fixed: "left" },
  { title: "City", width: 150, dataIndex: "city", key: "city" },
  { title: "Street", width: 200, dataIndex: "street", key: "street" },
  { title: "Building", width: 150, dataIndex: "building", key: "building" },
  { title: "Door No.", width: 100, dataIndex: "door", key: "door" },
  { title: "Postcode", width: 120, dataIndex: "postcode", key: "postcode" },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 100,
    render: () => <a className="text-primary hover:underline cursor-pointer">action</a>,
  },
];

const data: DataType[] = Array.from({ length: 6 }).map((_, i) => ({
  key: String(i),
  name: `John Doe ${i}`,
  age: 30 + i,
  street: "Lake Park",
  building: "Tower B",
  door: 2035 + i,
  city: "San Francisco",
  postcode: 94107,
}));

export default function FixedColumnsDemo() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 1100 }}
      bordered
    />
  );
}
