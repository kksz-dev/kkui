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
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    filters: [
      { text: "Joe", value: "Joe" },
      { text: "Jim", value: "Jim" },
    ],
    onFilter: (value, record) => record.name.includes(String(value)),
    filterSearch: true,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
      { text: "Sydney", value: "Sydney" },
    ],
    onFilter: (value, record) => record.address.includes(String(value)),
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (tags: string[]) => (
      <div className="flex gap-1">
        {tags.map((tag) => (
          <Tag key={tag} color={tag === "loser" ? "error" : tag === "cool" ? "purple" : "success"}>
            {tag}
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
  { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park", tags: ["loser"] },
];

export default function FilterSort() {
  return <Table columns={columns} dataSource={data} />;
}
