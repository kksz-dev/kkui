import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name", width: 140, fixed: "left" },
  {
    title: "Other",
    children: [
      { title: "Age", dataIndex: "age", key: "age", width: 100, sorter: (a, b) => a.age - b.age },
      {
        title: "Address",
        children: [
          { title: "Street", dataIndex: "street", key: "street", width: 150 },
          {
            title: "Block",
            children: [
              { title: "Building", dataIndex: "building", key: "building", width: 110 },
              { title: "Door No.", dataIndex: "number", key: "number", width: 110 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Company",
    children: [
      { title: "Company Address", dataIndex: "companyAddress", key: "companyAddress", width: 190 },
      { title: "Company Name", dataIndex: "companyName", key: "companyName", width: 160 },
    ],
  },
  { title: "Gender", dataIndex: "gender", key: "gender", width: 100, fixed: "right" },
];

const data: DataType[] = Array.from({ length: 8 }).map((_, i) => ({
  key: String(i),
  name: `John Brown ${i}`,
  age: 25 + i,
  street: "Lake Park",
  building: "C",
  number: 2035 + i,
  companyAddress: "Lake Street 42",
  companyName: "SoftLake Co",
  gender: i % 2 === 0 ? "M" : "F",
}));

export default function GroupingColumnsDemo() {
  return <Table columns={columns} dataSource={data} bordered scroll={{ x: 1200 }} pagination={false} />;
}
