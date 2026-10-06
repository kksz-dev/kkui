import { Progress } from "@/components/ui/progress";

export default function FormatDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} />
      <Progress type="circle" percent={100} format={() => "Done"} />
    </div>
  );
}
