import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Tag } from "@/components/ui/tag";

interface UserRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  status: "active" | "inactive" | "pending";
}

const columns: DataGridColumn<UserRecord>[] = [
  {
    key: "name",
    title: "Employee Name",
    dataIndex: "name",
    pin: "left",
    sortable: true,
    width: 180,
  },
  {
    key: "role",
    title: "Position",
    dataIndex: "role",
    sortable: true,
  },
  {
    key: "department",
    title: "Department",
    dataIndex: "department",
    sortable: true,
  },
  {
    key: "salary",
    title: "Salary ($)",
    dataIndex: "salary",
    align: "right",
    sortable: true,
    summary: "sum",
    render: (val) => `$${Number(val).toLocaleString()}`,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (val) => (
      <Tag color={val === "active" ? "success" : val === "pending" ? "warning" : "default"}>
        {val}
      </Tag>
    ),
  },
];

const dataSource: UserRecord[] = [
  { id: "1", name: "Alice Johnson", role: "Lead Engineer", department: "Core Dev", salary: 145000, status: "active" },
  { id: "2", name: "Bob Smith", role: "Product Designer", department: "UX Design", salary: 110000, status: "active" },
  { id: "3", name: "Charlie Brown", role: "DevOps Architect", department: "Infra", salary: 135000, status: "pending" },
  { id: "4", name: "Diana Prince", role: "Security Engineer", department: "CyberSec", salary: 150000, status: "active" },
  { id: "5", name: "Ethan Hunt", role: "QA Engineer", department: "Testing", salary: 95000, status: "inactive" },
];

export default function Basic() {
  return (
    <DataGrid
      title="Employee Directory"
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      selectable
      showSummary
    />
  );
}
