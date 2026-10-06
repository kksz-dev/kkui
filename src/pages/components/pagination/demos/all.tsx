import { Pagination } from "@/components/ui/pagination";

export default function Demo() {
  return (
    <Pagination
      total={85}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `Total ${total} items`}
    />
  );
}
