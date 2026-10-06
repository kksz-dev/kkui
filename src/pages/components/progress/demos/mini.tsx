import { Progress } from "@/components/ui/progress";

export default function MiniDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Progress percent={30} size="small" />
        <Progress percent={50} size="small" status="active" />
        <Progress percent={70} size="small" status="exception" />
        <Progress percent={100} size="small" />
      </div>
      <div className="flex items-center gap-6">
        <Progress type="circle" percent={30} size="small" />
        <Progress type="circle" percent={70} size="small" status="exception" />
        <Progress type="circle" percent={100} size="small" />
      </div>
    </div>
  );
}
