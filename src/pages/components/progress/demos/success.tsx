import { Progress } from "@/components/ui/progress";

export default function SuccessDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Progress percent={60} success={{ percent: 30 }} />
      <Progress percent={70} success={{ percent: 30, strokeColor: "#52c41a" }} status="exception" />
    </div>
  );
}
