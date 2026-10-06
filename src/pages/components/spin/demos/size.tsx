import { Spin } from "@/components/ui/spin";

export default function Size() {
  return (
    <div className="flex items-center gap-8">
      <Spin size="small" />
      <Spin size="default" />
      <Spin size="large" />
    </div>
  );
}
