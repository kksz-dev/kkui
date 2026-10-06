import * as React from "react";
import { Table, type ColumnType } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
}

const EditingKeyContext = React.createContext<React.Key | null>(null);

/** `components.body.row` — highlights the row that is currently being edited. */
function EditableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { "data-row-key"?: React.Key }) {
  const editingKey = React.useContext(EditingKeyContext);
  const editing = props["data-row-key"] === editingKey;
  return (
    <tr {...props} className={cn(className, editing && "bg-primary-bg/50")}>
      {children}
    </tr>
  );
}

/** `components.body.cell` — receives the extra props returned by `column.onCell`. */
function EditableCell({
  editing,
  value,
  onValueChange,
  children,
  ...restProps
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  editing?: boolean;
  value?: string;
  onValueChange?: (next: string) => void;
}) {
  return (
    <td {...restProps}>
      {editing ? (
        <Input size="sm" value={value} onChange={(e) => onValueChange?.(e.target.value)} />
      ) : (
        children
      )}
    </td>
  );
}

const initial: DataType[] = Array.from({ length: 4 }).map((_, i) => ({
  key: String(i),
  name: `Edward King ${i}`,
  age: "32",
  address: `London, Park Lane no. ${i}`,
}));

export default function EditableRowDemo() {
  const [data, setData] = React.useState<DataType[]>(initial);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<DataType | null>(null);

  const editable = (field: keyof DataType): ColumnType<DataType>["onCell"] =>
    (record) => ({
      editing: record.key === editingKey,
      value: draft?.[field],
      onValueChange: (next: string) => setDraft((d) => (d ? { ...d, [field]: next } : d)),
    });

  const columns: ColumnType<DataType>[] = [
    { title: "Name", dataIndex: "name", width: "30%", onCell: editable("name") },
    { title: "Age", dataIndex: "age", width: 120, onCell: editable("age") },
    { title: "Address", dataIndex: "address", onCell: editable("address") },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (_, record) =>
        record.key === editingKey ? (
          <div className="flex gap-1">
            <Button
              size="sm"
              type="link"
              onClick={() => {
                if (draft) setData((prev) => prev.map((r) => (r.key === draft.key ? draft : r)));
                setEditingKey(null);
                setDraft(null);
              }}
            >
              Save
            </Button>
            <Button size="sm" type="link" onClick={() => { setEditingKey(null); setDraft(null); }}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            type="link"
            disabled={editingKey !== null}
            onClick={() => {
              setEditingKey(record.key);
              setDraft({ ...record });
            }}
          >
            Edit
          </Button>
        ),
    },
  ];

  return (
    <EditingKeyContext.Provider value={editingKey}>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        components={{ body: { row: EditableRow, cell: EditableCell } }}
      />
    </EditingKeyContext.Provider>
  );
}
