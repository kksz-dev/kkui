import { PivotGrid, type PivotGridField } from "@/components/ui/pivot-grid";

interface SaleRecord {
  region: string;
  country: string;
  category: string;
  quarter: string;
  revenue: number;
  units: number;
}

const REGIONS = [
  { region: "APAC", countries: ["Thailand", "Japan"] },
  { region: "EMEA", countries: ["Germany", "Spain"] },
];
const CATEGORIES = ["Hardware", "Services"];
const QUARTERS = ["Q1", "Q2"];

const dataSource: SaleRecord[] = REGIONS.flatMap((r, ri) =>
  r.countries.flatMap((country, ci) =>
    CATEGORIES.flatMap((category, cat) =>
      QUARTERS.map((quarter, qi) => ({
        region: r.region,
        country,
        category,
        quarter,
        revenue: 12000 + ri * 5000 + ci * 3100 + cat * 2400 + qi * 1700,
        units: 60 + ri * 12 + ci * 7 + cat * 5 + qi * 3,
      })),
    ),
  ),
);

const fields: PivotGridField<SaleRecord>[] = [
  { key: "region", caption: "Region", dataIndex: "region", area: "row" },
  { key: "country", caption: "Country", dataIndex: "country", area: "row" },
  { key: "category", caption: "Category", dataIndex: "category", area: "column" },
  { key: "quarter", caption: "Quarter", dataIndex: "quarter", area: "column" },
  { key: "revenue", caption: "Revenue", dataIndex: "revenue", area: "data", summaryType: "sum" },
  { key: "units", caption: "Units", dataIndex: "units", area: "data", summaryType: "avg" },
];

export default function NestedDemo() {
  return <PivotGrid dataSource={dataSource} fields={fields} />;
}
