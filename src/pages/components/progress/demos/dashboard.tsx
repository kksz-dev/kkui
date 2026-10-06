import { Progress } from "@/components/ui/progress";

export default function DashboardDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Progress type="dashboard" percent={75} />
      <Progress type="dashboard" percent={70} status="exception" />
      <Progress type="dashboard" percent={100} />
    </div>
  );
}
