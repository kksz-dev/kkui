import { CircleHelp, MessageSquare, Settings } from "lucide-react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  return (
    <div className="relative flex h-32 items-end justify-end gap-4 rounded-lg border border-dashed border-border bg-bg-layout p-4">
      <FloatButton className="static" icon={<MessageSquare />} tooltip="Open the chat" />
      <FloatButton className="static" icon={<CircleHelp />} tooltip={<span>Documentation</span>} />
      <FloatButton className="static" shape="square" icon={<Settings />} description="SETUP" tooltip="Preferences" />
    </div>
  );
}
