import { Progress } from "@/components/ui/progress";

export default function CircleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Progress type="circle" percent={75} />
      <Progress type="circle" percent={70} status="exception" />
      <Progress type="circle" percent={100} />
    </div>
  );
}
