import * as React from "react";
import { Pencil } from "lucide-react";
import { Table, type ColumnType } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
}

const initial: DataType[] = Array.from({ length: 4 }).map((_, i) => ({
  key: String(i),
  name: `Edward King ${i}`,
  age: "32",
  address: `London, Park Lane no. ${i}`,
}));

/** Click a cell to edit it; Enter or blur saves, Escape cancels. */
function EditableText({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="kk-press group flex w-full items-center gap-1 rounded-sm px-1 py-0.5 text-left transition-colors duration-fast hover:bg-fill-tertiary"
      >
        <span className="truncate">{value}</span>
        <Pencil className="size-3 shrink-0 text-text-quaternary opacity-0 transition-opacity duration-fast group-hover:opacity-100" />
      </button>
    );
  }

  const commit = () => {
    setEditing(false);
    onSave(draft);
  };

  return (
    <Input
      size="sm"
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onPressEnter={commit}
      onKeyDown={(e) => {
        if (e.key === "Escape") setEditing(false);
      }}
    />
  );
}

export default function EditableCellDemo() {
  const [data, setData] = React.useState<DataType[]>(initial);

  const save = (key: string, field: keyof DataType, value: string) =>
    setData((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));

  const columns: ColumnType<DataType>[] = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      render: (text: string, record) => (
        <EditableText value={text} onSave={(v) => save(record.key, "name", v)} />
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      width: 120,
      render: (text: string, record) => (
        <EditableText value={text} onSave={(v) => save(record.key, "age", v)} />
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (text: string, record) => (
        <EditableText value={text} onSave={(v) => save(record.key, "address", v)} />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          size="sm"
          type="link"
          danger
          onClick={() => setData((prev) => prev.filter((r) => r.key !== record.key))}
        >
          Delete
        </Button>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} bordered pagination={false} />;
}
