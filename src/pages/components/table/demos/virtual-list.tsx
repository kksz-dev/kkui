import { Table, type ColumnType } from "@/components/ui/table";

interface RowType {
  key: number;
  index: number;
  a: string;
  b: string;
  c: string;
  d: string;
}

const columns: ColumnType<RowType>[] = [
  { title: "#", dataIndex: "index", width: 90, fixed: "left" },
  { title: "Column A", dataIndex: "a", width: 160 },
  { title: "Column B", dataIndex: "b", width: 160 },
  { title: "Column C", dataIndex: "c", width: 160 },
  { title: "Column D", dataIndex: "d", width: 220 },
];

// 10,000 rows — only the visible window is mounted.
const data: RowType[] = Array.from({ length: 10000 }).map((_, i) => ({
  key: i,
  index: i + 1,
  a: `A-${i}`,
  b: `B-${i}`,
  c: `C-${i}`,
  d: `Row ${i} payload value`,
}));

export default function VirtualListDemo() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      virtual
      bordered
      pagination={false}
      scroll={{ x: 790, y: 320 }}
    />
  );
}
