import { Table, type ColumnType } from "@/components/ui/table";

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

const data: DataType[] = Array.from({ length: 40 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32 + (i % 7),
  address: `London, Park Lane no. ${i}`,
}));

export default function StickyHeaderDemo() {
  // `sticky` pins the header to the nearest scrolling ancestor (here the box below,
  // in a real page it is the window).
  return (
    <div className="kk-scrollbar max-h-72 overflow-auto rounded-xl">
      <Table columns={columns} dataSource={data} pagination={false} sticky bordered />
    </div>
  );
}
