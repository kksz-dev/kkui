import { Table, type ColumnType } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name", sorter: true },
  { title: "Age", dataIndex: "age", key: "age", sorter: true },
  { title: "Address", dataIndex: "address", key: "address" },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    render: (_, { tags }) => (
      <div className="flex gap-1">
        {tags.map((tag: string) => (
          <Tag color={tag === "loser" ? "error" : "processing"} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        ))}
      </div>
    ),
  },
];

const data: DataType[] = [
  { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park", tags: ["nice", "developer"] },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park", tags: ["loser"] },
  { key: "3", name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park", tags: ["cool", "teacher"] },
];

export default function Demo() {
  return <Table<DataType> columns={columns} dataSource={data} />;
}
