import { Search } from "lucide-react";
import { Table, type ColumnType } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [
  { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Joe Black", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Jim Green", age: 32, address: "Sydney No. 1 Lake Park" },
  { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
];

export default function CustomFilterPanelDemo() {
  const searchColumn = (dataIndex: keyof DataType): Partial<ColumnType<DataType>> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="w-56 space-y-2 p-1">
        <Input
          size="sm"
          autoFocus
          placeholder={`Search ${dataIndex}`}
          value={(selectedKeys[0] as string) ?? ""}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
        />
        <div className="flex justify-between gap-2">
          <Button size="sm" onClick={clearFilters} className="flex-1">
            Reset
          </Button>
          <Button size="sm" type="primary" icon={<Search className="size-3" />} onClick={() => confirm()} className="flex-1">
            Search
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <Search className={filtered ? "size-3 text-primary" : "size-3"} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
  });

  const columns: ColumnType<DataType>[] = [
    { title: "Name", dataIndex: "name", key: "name", width: "30%", ...searchColumn("name") },
    { title: "Age", dataIndex: "age", key: "age", width: 120, ...searchColumn("age") },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filterSearch: true,
      filterMode: "tree",
      filters: [
        {
          text: "Europe",
          value: "europe",
          children: [{ text: "London", value: "London" }],
        },
        {
          text: "Rest of the world",
          value: "world",
          children: [
            { text: "New York", value: "New York" },
            { text: "Sydney", value: "Sydney" },
          ],
        },
      ],
      onFilter: (value, record) => record.address.includes(String(value)),
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} bordered />;
}
