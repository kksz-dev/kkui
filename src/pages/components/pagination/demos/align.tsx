import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination align="start" defaultCurrent={1} total={50} />
      <Pagination align="center" defaultCurrent={1} total={50} />
      <Pagination align="end" defaultCurrent={1} total={50} />
    </div>
  );
}
