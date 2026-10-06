import { Bell, MessageSquare } from "lucide-react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  return (
    <div className="relative flex h-32 items-end justify-end gap-5 rounded-lg border border-dashed border-border bg-bg-layout p-4">
      <FloatButton className="static" icon={<MessageSquare />} badge={{ count: 5 }} />
      <FloatButton className="static" icon={<Bell />} badge={{ count: 128, overflowCount: 99 }} />
      <FloatButton className="static" icon={<Bell />} badge={{ dot: true }} />
      <FloatButton className="static" type="primary" icon={<Bell />} badge={{ count: 9, color: "green", offset: [-4, 4] }} />
    </div>
  );
}
