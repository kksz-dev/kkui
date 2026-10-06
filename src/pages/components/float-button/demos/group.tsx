import { CircleHelp, MessageSquare, Settings } from "lucide-react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  // Without `trigger` the group joins its children into one floating block.
  return (
    <div className="relative h-56 overflow-hidden rounded-lg border border-dashed border-border bg-bg-layout">
      <FloatButton.Group className="absolute right-4 bottom-4">
        <FloatButton icon={<MessageSquare />} tooltip="Chat" />
        <FloatButton icon={<CircleHelp />} tooltip="Help" />
      </FloatButton.Group>

      <FloatButton.Group shape="square" className="absolute right-24 bottom-4">
        <FloatButton icon={<MessageSquare />} />
        <FloatButton icon={<CircleHelp />} />
        <FloatButton icon={<Settings />} />
      </FloatButton.Group>
    </div>
  );
}
