import { CircleHelp, MessageSquare } from "lucide-react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  // FloatButton is `position: fixed` (right 24px / bottom 48px) by default.
  // The demos re-scope it with `absolute` inside a relative box so the docs stay usable.
  return (
    <div className="relative h-40 overflow-hidden rounded-lg border border-dashed border-border bg-bg-layout">
      <FloatButton className="absolute right-4 bottom-4" icon={<MessageSquare />} onClick={() => console.log("chat")} />
      <FloatButton
        className="absolute right-4 bottom-20"
        icon={<CircleHelp />}
        href="https://kkui.kksz.dev"
        target="_blank"
      />
    </div>
  );
}
