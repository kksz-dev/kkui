import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { makeEmployees, type EmployeeRecord } from "./shared-data";

const rows = makeEmployees(5000);

const columns: DataGridColumn<EmployeeRecord>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 110 },
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "role", title: "Role", dataIndex: "role", filterable: true },
  { key: "city", title: "City", dataIndex: "city" },
  { key: "salary", title: "Salary", dataIndex: "salary", align: "right", sortable: true },
];

export default function VirtualDemo() {
  return <DataGrid columns={columns} dataSource={rows} virtual height={360} density="compact" selectable={false} />;
}
