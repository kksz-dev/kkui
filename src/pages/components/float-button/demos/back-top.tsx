import { useRef } from "react";
import { FloatButton } from "@/components/ui/float-button";

export default function Demo() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="kk-scrollbar h-48 overflow-y-auto rounded-lg border border-dashed border-border bg-bg-layout p-4"
      >
        {Array.from({ length: 16 }, (_, i) => (
          <p key={i} className="py-1 text-text-secondary">
            Scroll down inside this box — line {i + 1}
          </p>
        ))}
      </div>
      <FloatButton.BackTop
        target={() => scroller.current ?? window}
        visibilityHeight={60}
        duration={600}
        tooltip="Back to top"
        type="primary"
        className="absolute right-4 bottom-4"
      />
    </div>
  );
}
