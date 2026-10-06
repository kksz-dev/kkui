import { Progress } from "@/components/ui/progress";

const twoColors = { "0%": "#108ee9", "100%": "#87d068" };
const conicColors = { from: "#108ee9", to: "#87d068" };

export default function GradientDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Progress percent={99.9} strokeColor={twoColors} />
      <Progress percent={50} status="active" strokeColor={{ from: "#108ee9", to: "#ff4d4f" }} />
      <div className="flex items-center gap-6">
        <Progress type="circle" percent={90} strokeColor={conicColors} />
        <Progress type="dashboard" percent={80} strokeColor={twoColors} />
      </div>
    </div>
  );
}
