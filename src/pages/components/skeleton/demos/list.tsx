import { Skeleton } from "@/components/ui/skeleton";

export default function ListDemo() {
  return (
    <div className="divide-y divide-border-secondary rounded-md border border-border-secondary bg-bg-container p-4">
      <div className="py-3">
        <Skeleton avatar paragraph={{ rows: 2 }} active />
      </div>
      <div className="py-3">
        <Skeleton avatar paragraph={{ rows: 2 }} active />
      </div>
      <div className="py-3">
        <Skeleton avatar paragraph={{ rows: 2 }} active />
      </div>
    </div>
  );
}
