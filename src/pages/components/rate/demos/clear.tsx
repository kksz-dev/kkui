import { Rate } from "@/components/ui/rate";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Rate defaultValue={3} />
        <span className="text-xs text-text-tertiary">allowClear: true</span>
      </div>
      <div className="flex items-center gap-2">
        <Rate allowClear={false} defaultValue={3} />
        <span className="text-xs text-text-tertiary">allowClear: false</span>
      </div>
    </div>
  );
}
