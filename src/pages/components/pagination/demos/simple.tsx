import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination simple defaultCurrent={2} total={50} />
      <Pagination simple={{ readOnly: true }} defaultCurrent={2} total={50} />
      <Pagination disabled simple defaultCurrent={2} total={50} />
    </div>
  );
}
