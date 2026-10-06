import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination size="small" total={50} />
      <Pagination size="small" total={50} showSizeChanger showQuickJumper />
      <Pagination size="small" total={50} showTotal={(total) => `Total ${total} items`} />
    </div>
  );
}
