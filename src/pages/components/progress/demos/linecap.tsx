import { Progress } from "@/components/ui/progress";

export default function LinecapDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Progress strokeLinecap="round" percent={75} />
        <Progress strokeLinecap="butt" percent={75} />
        <Progress strokeLinecap="square" percent={75} />
      </div>
      <div className="flex items-center gap-6">
        <Progress type="circle" strokeLinecap="round" percent={75} />
        <Progress type="circle" strokeLinecap="butt" percent={75} />
        <Progress type="circle" strokeLinecap="square" percent={75} />
      </div>
    </div>
  );
}
