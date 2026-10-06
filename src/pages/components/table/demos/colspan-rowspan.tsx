import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  tel: string;
  phone: number;
  address: string;
}

// The first four rows share one telephone number, the last two share another one.
const columns: ColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text: string) => <a className="cursor-pointer text-primary hover:underline">{text}</a>,
    onCell: (_, index) => ({ colSpan: index === 4 ? 5 : 1 }),
  },
  {
    title: "Age",
    dataIndex: "age",
    onCell: (_, index) => ({ colSpan: index === 4 ? 0 : 1 }),
  },
  {
    title: "Home phone",
    colSpan: 2,
    dataIndex: "tel",
    onCell: (_, index) => {
      if (index === 2) return { rowSpan: 2 };
      if (index === 3) return { rowSpan: 0 };
      if (index === 4) return { colSpan: 0 };
      return {};
    },
  },
  {
    title: "Phone",
    colSpan: 0,
    dataIndex: "phone",
    onCell: (_, index) => ({ colSpan: index === 4 ? 0 : 1 }),
  },
  {
    title: "Address",
    dataIndex: "address",
    onCell: (_, index) => ({ colSpan: index === 4 ? 0 : 1 }),
  },
];

const data: DataType[] = [
  { key: "1", name: "John Brown", age: 32, tel: "0571-22098909", phone: 18889898989, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Jim Green", age: 42, tel: "0571-22098333", phone: 18889898888, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, tel: "0575-22098909", phone: 18900010002, address: "Sydney No. 1 Lake Park" },
  { key: "4", name: "Jim Red", age: 18, tel: "0575-22098909", phone: 18900010002, address: "London No. 2 Lake Park" },
  { key: "5", name: "Jake White - merged row", age: 18, tel: "0575-22098909", phone: 18900010002, address: "Dublin No. 2 Lake Park" },
];

export default function ColspanRowspanDemo() {
  return <Table columns={columns} dataSource={data} bordered pagination={false} />;
}
