import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Tag } from "@/components/ui/tag";
import { makeEmployees, type EmployeeRecord } from "./shared-data";

const columns: DataGridColumn<EmployeeRecord>[] = [
  { key: "name", title: "Name", dataIndex: "name", pin: "left", width: 170, sortable: true },
  { key: "role", title: "Role", dataIndex: "role", filterable: true },
  { key: "department", title: "Department", dataIndex: "department", groupable: true },
  { key: "city", title: "City", dataIndex: "city" },
  { key: "salary", title: "Salary", dataIndex: "salary", align: "right", sortable: true, summary: "avg" },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    pin: "right",
    width: 110,
    render: (value: EmployeeRecord["status"]) => (
      <Tag color={value === "active" ? "success" : value === "pending" ? "warning" : "default"}>{value}</Tag>
    ),
  },
];

export default function MasterDetailDemo() {
  return (
    <DataGrid
      columns={columns}
      dataSource={makeEmployees(14)}
      pagination={{ pageSize: 7 }}
      expandable={{
        expandedRowRender: (record) => (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-text-secondary sm:grid-cols-4">
            <div>
              <dt className="text-text-quaternary">Employee ID</dt>
              <dd className="font-medium text-text">{record.id}</dd>
            </div>
            <div>
              <dt className="text-text-quaternary">Department</dt>
              <dd className="font-medium text-text">{record.department}</dd>
            </div>
            <div>
              <dt className="text-text-quaternary">Base city</dt>
              <dd className="font-medium text-text">{record.city}</dd>
            </div>
            <div>
              <dt className="text-text-quaternary">Annual</dt>
              <dd className="font-medium text-text">{(record.salary * 12).toLocaleString()}</dd>
            </div>
          </dl>
        ),
      }}
    />
  );
}
