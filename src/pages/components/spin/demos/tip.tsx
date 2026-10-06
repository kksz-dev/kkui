import { Spin } from "@/components/ui/spin";

export default function Tip() {
  return (
    <div className="flex flex-col gap-4">
      <Spin tip="Loading data...">
        <div className="rounded-md border border-border-secondary bg-bg-container p-6 text-center text-sm text-text">
          <p className="text-text-secondary">Custom container content goes here.</p>
        </div>
      </Spin>
    </div>
  );
}
