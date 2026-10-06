import { DonutChart } from "@/components/ui/chart";

const data = [
  { key: "ucs", label: "UCS", value: 5420 },
  { key: "sss", label: "Social Security", value: 2310 },
  { key: "ofc", label: "Civil servant", value: 1780 },
  { key: "cash", label: "Self-pay", value: 940 },
];

export default function DonutDemo() {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <DonutChart
      data={data}
      ariaLabel="Coverage scheme distribution"
      center={
        <>
          <span className="text-xs text-text-tertiary">Total</span>
          <span className="text-lg font-semibold text-text-heading">{total.toLocaleString()}</span>
        </>
      }
    />
  );
}
