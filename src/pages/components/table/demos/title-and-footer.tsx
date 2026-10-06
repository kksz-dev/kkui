import { Table, type ColumnType } from "@/components/ui/table";

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

export default function TitleAndFooterDemo() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
      title={(currentData) => `Employees on this page: ${currentData.length}`}
      footer={() => "Data provided by the HR department"}
    />
  );
}
