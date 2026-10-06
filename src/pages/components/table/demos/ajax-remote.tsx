import * as React from "react";
import { Table, type ColumnType, type FilterValue, type SorterResult } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";

interface UserRow {
  key: number;
  name: string;
  gender: "male" | "female";
  email: string;
  age: number;
}

const ALL_USERS: UserRow[] = Array.from({ length: 143 }).map((_, i) => ({
  key: i,
  name: `User ${String(i + 1).padStart(3, "0")}`,
  gender: i % 3 === 0 ? "female" : "male",
  email: `user${i + 1}@example.com`,
  age: 20 + (i % 40),
}));

/** Stand-in for a REST endpoint: filters, sorts and pages on the "server". */
function fetchUsers(params: {
  page: number;
  pageSize: number;
  gender?: FilterValue[] | null;
  sortField?: React.Key;
  sortOrder?: "ascend" | "descend" | null;
}): Promise<{ rows: UserRow[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = ALL_USERS;
      if (params.gender?.length) rows = rows.filter((r) => params.gender!.includes(r.gender));
      if (params.sortField === "age" && params.sortOrder) {
        const dir = params.sortOrder === "ascend" ? 1 : -1;
        rows = [...rows].sort((a, b) => (a.age - b.age) * dir);
      }
      const start = (params.page - 1) * params.pageSize;
      resolve({ rows: rows.slice(start, start + params.pageSize), total: rows.length });
    }, 600);
  });
}

export default function AjaxRemoteDemo() {
  const [rows, setRows] = React.useState<UserRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [gender, setGender] = React.useState<FilterValue[] | null>(null);
  const [sort, setSort] = React.useState<{ field?: React.Key; order?: "ascend" | "descend" | null }>({});

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUsers({ page, pageSize, gender, sortField: sort.field, sortOrder: sort.order }).then((res) => {
      if (cancelled) return;
      setRows(res.rows);
      setTotal(res.total);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, gender, sort]);

  const columns: ColumnType<UserRow>[] = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 140,
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      filteredValue: gender,
      render: (value: UserRow["gender"]) => (
        <Tag color={value === "male" ? "processing" : "magenta"}>{value}</Tag>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 120,
      sorter: true,
      sortOrder: sort.field === "age" ? (sort.order ?? null) : null,
    },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  return (
    <Table<UserRow>
      columns={columns}
      dataSource={rows}
      rowKey="key"
      loading={{ spinning: loading, tip: "Fetching page…" }}
      pagination={{ current: page, pageSize, total, showSizeChanger: true, pageSizeOptions: [5, 10, 20] }}
      onChange={(paginationInfo, filters, sorter: SorterResult<UserRow>) => {
        setPage(paginationInfo.current ?? 1);
        setPageSize(paginationInfo.pageSize ?? 5);
        setGender(filters.gender ?? null);
        setSort({ field: sorter.columnKey, order: sorter.order });
      }}
    />
  );
}
