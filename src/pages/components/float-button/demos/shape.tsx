import { CircleHelp } from "lucide-react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  return (
    <div className="relative flex h-32 items-end justify-end gap-4 rounded-lg border border-dashed border-border bg-bg-layout p-4">
      <FloatButton className="static" shape="circle" icon={<CircleHelp />} />
      <FloatButton className="static" shape="square" icon={<CircleHelp />} />
      <FloatButton className="static" shape="circle" type="primary" icon={<CircleHelp />} />
      <FloatButton className="static" shape="square" type="primary" icon={<CircleHelp />} />
    </div>
  );
}
