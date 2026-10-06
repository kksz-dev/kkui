import { AreaChart } from "@/components/ui/chart";

const data = Array.from({ length: 14 }, (_, i) => ({
  label: `${i + 1}`,
  claims: 180 + Math.round(Math.sin(i / 2) * 60) + i * 6,
}));

export default function AreaDemo() {
  return <AreaChart data={data} series={[{ key: "claims", name: "Claims per day" }]} ariaLabel="Claims per day" height={200} dots />;
}
