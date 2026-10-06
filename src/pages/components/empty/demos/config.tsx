import { Empty } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export default function ConfigDemo() {
  return (
    <div className="w-full rounded-md border border-border-secondary bg-bg-container p-6">
      <div className="mb-4 flex items-center justify-between border-b border-border-secondary pb-3">
        <span className="font-medium text-text-heading">Order History</span>
        <Button size="sm">Refresh</Button>
      </div>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No orders found in this billing cycle"
      >
        <Button size="sm" type="primary">Place New Order</Button>
      </Empty>
    </div>
  );
}
