import { Progress } from "@/components/ui/progress";

export default function LineDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Progress percent={30} />
      <Progress percent={50} status="active" />
      <Progress percent={70} status="exception" />
      <Progress percent={100} />
      <Progress percent={50} showInfo={false} />
    </div>
  );
}
