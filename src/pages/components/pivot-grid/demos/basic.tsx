import { PivotGrid, type PivotGridField } from "@/components/ui/pivot-grid";

interface SalesRecord {
  region: string;
  category: string;
  amount: number;
}

const fields: PivotGridField<SalesRecord>[] = [
  { key: "region", caption: "Region", dataIndex: "region", area: "row" },
  { key: "category", caption: "Category", dataIndex: "category", area: "column" },
  { key: "amount", caption: "Revenue", dataIndex: "amount", area: "data", summaryType: "sum" },
];

const data: SalesRecord[] = [
  { region: "North America", category: "Hardware", amount: 12000 },
  { region: "North America", category: "Software", amount: 28000 },
  { region: "North America", category: "Services", amount: 15000 },
  { region: "Europe", category: "Hardware", amount: 9500 },
  { region: "Europe", category: "Software", amount: 22000 },
  { region: "Europe", category: "Services", amount: 11000 },
  { region: "Asia Pacific", category: "Hardware", amount: 16000 },
  { region: "Asia Pacific", category: "Software", amount: 31000 },
  { region: "Asia Pacific", category: "Services", amount: 18500 },
];

export default function Basic() {
  return <PivotGrid dataSource={data} fields={fields} />;
}
