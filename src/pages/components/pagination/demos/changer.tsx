import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination showSizeChanger defaultCurrent={3} total={500} onShowSizeChange={(current, size) => console.log(current, size)} />
      <Pagination showSizeChanger defaultCurrent={3} total={500} disabled />
    </div>
  );
}
