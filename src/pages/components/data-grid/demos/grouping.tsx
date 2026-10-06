import * as React from "react";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { makeEmployees, type EmployeeRecord } from "./shared-data";

const columns: DataGridColumn<EmployeeRecord>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true, filterable: true, width: 180 },
  { key: "department", title: "Department", dataIndex: "department", groupable: true, filterable: true },
  { key: "role", title: "Role", dataIndex: "role", groupable: true },
  { key: "salary", title: "Salary", dataIndex: "salary", align: "right", sortable: true, summary: "sum" },
];

export default function GroupingDemo() {
  // grouping is controlled here; the column menu also offers "Group by this column"
  const [groupBy, setGroupBy] = React.useState<string[]>(["department"]);

  return (
    <DataGrid
      title="Payroll"
      columns={columns}
      dataSource={makeEmployees(24)}
      groupBy={groupBy}
      onGroupByChange={setGroupBy}
      pagination={{ pageSize: 12 }}
    />
  );
}
