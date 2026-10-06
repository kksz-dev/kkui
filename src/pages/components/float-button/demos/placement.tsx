import { CircleHelp, MessageSquare } from "lucide-react";
import { FloatButton, type FloatButtonGroupPlacement } from "@/components/ui/float-button";

const spots: Record<FloatButtonGroupPlacement, string> = {
  top: "absolute right-4 bottom-4",
  bottom: "absolute top-4 right-4",
  left: "absolute right-4 bottom-4",
  right: "absolute bottom-4 left-4",
};

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(Object.keys(spots) as FloatButtonGroupPlacement[]).map((placement) => (
        <div key={placement} className="relative h-40 overflow-hidden rounded-lg border border-dashed border-border bg-bg-layout">
          <span className="absolute top-2 left-3 font-mono text-xs text-text-tertiary">placement="{placement}"</span>
          <FloatButton.Group trigger="click" placement={placement} className={spots[placement]}>
            <FloatButton icon={<MessageSquare />} />
            <FloatButton icon={<CircleHelp />} />
          </FloatButton.Group>
        </div>
      ))}
    </div>
  );
}
