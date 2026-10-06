import { CircleHelp, MessageSquare, Settings } from "lucide-react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  return (
    <div className="relative h-56 overflow-hidden rounded-lg border border-dashed border-border bg-bg-layout">
      <FloatButton.Group trigger="hover" tooltip="Hover me" className="absolute right-4 bottom-4">
        <FloatButton icon={<MessageSquare />} />
        <FloatButton icon={<CircleHelp />} />
      </FloatButton.Group>

      <FloatButton.Group trigger="click" shape="square" className="absolute right-24 bottom-4">
        <FloatButton type="primary" icon={<MessageSquare />} badge={{ count: 3 }} />
        <FloatButton icon={<CircleHelp />} />
        <FloatButton icon={<Settings />} href="https://kkui.kksz.dev" target="_blank" />
      </FloatButton.Group>
    </div>
  );
}
