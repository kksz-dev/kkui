import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={(page) => console.log(page)} />
      <Pagination showQuickJumper defaultCurrent={2} total={500} disabled />
    </div>
  );
}
