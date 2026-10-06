import { Progress } from "@/components/ui/progress";

export default function StepsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Progress percent={50} steps={3} />
      <Progress percent={30} steps={5} />
      <Progress percent={100} steps={5} size="small" strokeColor="#52c41a" />
      <Progress percent={60} steps={5} strokeColor={["#52c41a", "#52c41a", "#faad14"]} />
    </div>
  );
}
