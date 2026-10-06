import * as React from "react";
import { Button } from "@/components/ui/button";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { makeEmployees, type EmployeeRecord } from "./shared-data";

const columns: DataGridColumn<EmployeeRecord>[] = [
  { key: "name", title: "Name", dataIndex: "name" },
  { key: "role", title: "Role", dataIndex: "role" },
  { key: "salary", title: "Salary", dataIndex: "salary", align: "right" },
];

export default function LoadingStateDemo() {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<EmployeeRecord[]>([]);

  const reload = () => {
    setLoading(true);
    setRows([]);
    setTimeout(() => {
      setRows(makeEmployees(6));
      setLoading(false);
    }, 1200);
  };

  React.useEffect(reload, []);

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={reload}>
        Reload
      </Button>
      <DataGrid columns={columns} dataSource={rows} loading={loading} selectable={false} toolbar={false} />
    </div>
  );
}
