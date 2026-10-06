import { Table, type ColumnType } from "@/components/ui/table";

interface DataType {
  key: string;
  name: string;
  borrow: number;
  repayment: number;
}

const columns: ColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Borrow", dataIndex: "borrow", key: "borrow", align: "right" },
  { title: "Repayment", dataIndex: "repayment", key: "repayment", align: "right" },
];

const data: DataType[] = [
  { key: "1", name: "John Brown", borrow: 10, repayment: 33 },
  { key: "2", name: "Jim Green", borrow: 100, repayment: 0 },
  { key: "3", name: "Joe Black", borrow: 10, repayment: 10 },
  { key: "4", name: "Jim Red", borrow: 75, repayment: 45 },
];

export default function SummaryDemo() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
      summary={(pageData) => {
        let totalBorrow = 0;
        let totalRepayment = 0;
        pageData.forEach(({ borrow, repayment }) => {
          totalBorrow += borrow;
          totalRepayment += repayment;
        });

        return (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                {totalBorrow}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                {totalRepayment}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2} align="right" className="text-error">
                {totalBorrow - totalRepayment}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
}
