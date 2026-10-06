import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination disabled defaultCurrent={6} total={500} />
      <Pagination disabled showSizeChanger showQuickJumper defaultCurrent={6} total={500} />
    </div>
  );
}
