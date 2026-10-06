import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination total={85} showTotal={(total) => `Total ${total} items`} defaultPageSize={20} defaultCurrent={1} />
      <Pagination
        total={85}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        defaultPageSize={20}
        defaultCurrent={1}
      />
    </div>
  );
}
