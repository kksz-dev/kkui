import { LineChart } from "@/components/ui/chart";

const data = [
  { label: "Mar", opd: 4120, ipd: 860 },
  { label: "Apr", opd: 4380, ipd: 910 },
  { label: "May", opd: 3980, ipd: 1020 },
  { label: "Jun", opd: 4610, ipd: 980 },
  { label: "Jul", opd: 5020, ipd: 1140 },
  { label: "Aug", opd: 4890, ipd: 1210 },
];

export default function LineDemo() {
  return (
    <LineChart
      data={data}
      series={[
        { key: "opd", name: "OPD visits" },
        { key: "ipd", name: "IPD admissions" },
      ]}
      ariaLabel="Monthly OPD visits and IPD admissions"
      valueFormatter={(v) => v.toLocaleString()}
    />
  );
}
