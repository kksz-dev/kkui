import { Steps } from "@/components/ui/steps";

export default function InlineDemo() {
  return (
    <div className="rounded-lg border border-border bg-bg-container p-4">
      <div className="mb-3 font-medium text-text-heading">Order Status Tracker</div>
      <Steps
        type="inline"
        current={2}
        items={[
          { title: "Placed", description: "12:04" },
          { title: "Paid", description: "12:07" },
          { title: "Shipping", description: "today" },
          { title: "Delivered" },
        ]}
      />
    </div>
  );
}
