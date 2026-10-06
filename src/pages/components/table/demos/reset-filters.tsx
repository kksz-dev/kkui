import * as React from "react";
import { Table, type ColumnType, type FilterValue, type SortOrder } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [
  { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
  { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
];

export default function ResetFiltersDemo() {
  const [filters, setFilters] = React.useState<Record<string, FilterValue[] | null>>({});
  const [sortedInfo, setSortedInfo] = React.useState<{ columnKey?: React.Key; order?: SortOrder }>({});

  const columns: ColumnType<DataType>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: [
        { text: "Joe", value: "Joe" },
        { text: "Jim", value: "Jim" },
      ],
      filteredValue: filters.name ?? null,
      onFilter: (value, record) => record.name.includes(String(value)),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? (sortedInfo.order ?? null) : null,
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 120,
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? (sortedInfo.order ?? null) : null,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filters: [
        { text: "London", value: "London" },
        { text: "New York", value: "New York" },
      ],
      filteredValue: filters.address ?? null,
      onFilter: (value, record) => record.address.includes(String(value)),
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortOrder: sortedInfo.columnKey === "address" ? (sortedInfo.order ?? null) : null,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setFilters({})}>
          Clear filters
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setFilters({});
            setSortedInfo({});
          }}
        >
          Clear filters and sorters
        </Button>
        <Button size="sm" onClick={() => setSortedInfo({ columnKey: "age", order: "descend" })}>
          Sort age descending
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        onChange={(_pagination, nextFilters, sorter) => {
          setFilters(nextFilters);
          setSortedInfo({ columnKey: sorter.columnKey, order: sorter.order });
        }}
      />
    </div>
  );
}
