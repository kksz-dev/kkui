import { Table, type ColumnType } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ParentRow {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  createdAt: string;
}

interface ChildRow {
  key: number;
  date: string;
  name: string;
  upgradeNum: string;
  status: "success" | "error";
}

const parentColumns: ColumnType<ParentRow>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Platform", dataIndex: "platform", key: "platform", width: 120 },
  { title: "Version", dataIndex: "version", key: "version", width: 110 },
  { title: "Upgraded", dataIndex: "upgradeNum", key: "upgradeNum", width: 110 },
  { title: "Creation Time", dataIndex: "createdAt", key: "createdAt", width: 160 },
];

const childColumns: ColumnType<ChildRow>[] = [
  { title: "Date", dataIndex: "date", key: "date", width: 140 },
  { title: "Name", dataIndex: "name", key: "name" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 130,
    render: (status: ChildRow["status"]) => (
      <Badge status={status === "success" ? "success" : "error"} text={status} />
    ),
  },
  { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum", width: 150 },
  {
    title: "Action",
    key: "action",
    width: 150,
    render: () => (
      <div className="flex gap-1">
        <Button size="sm" type="link">
          Pause
        </Button>
        <Button size="sm" type="link">
          Stop
        </Button>
      </div>
    ),
  },
];

const parentData: ParentRow[] = Array.from({ length: 3 }).map((_, i) => ({
  key: i,
  name: `Screen ${i}`,
  platform: "iOS",
  version: `10.3.4.${5654 + i}`,
  upgradeNum: 500 + i,
  createdAt: "2026-08-19",
}));

const childData: ChildRow[] = Array.from({ length: 3 }).map((_, i) => ({
  key: i,
  date: "2026-08-19",
  name: `Release build ${i}`,
  upgradeNum: "Upgraded: 56",
  status: i === 1 ? "error" : "success",
}));

export default function NestedTableDemo() {
  return (
    <Table
      columns={parentColumns}
      dataSource={parentData}
      pagination={false}
      bordered
      expandable={{
        defaultExpandedRowKeys: [0],
        expandedRowRender: () => (
          <Table columns={childColumns} dataSource={childData} pagination={false} size="sm" />
        ),
      }}
    />
  );
}
