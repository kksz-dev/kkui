import { useRef } from "react";
import { Anchor } from "@/components/ui/anchor";

const parts = ["h-part-1", "h-part-2", "h-part-3", "h-part-4"];
const colors = ["bg-primary-bg", "bg-success-bg", "bg-warning-bg", "bg-error-bg"];

export default function Demo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-lg border border-border-secondary">
      <Anchor
        direction="horizontal"
        affix={false}
        getContainer={() => container.current}
        className="rounded-t-lg bg-bg-container px-4 pt-3"
        items={parts.map((id, i) => ({ key: id, href: `#${id}`, title: `Part ${i + 1}` }))}
      />
      <div ref={container} className="h-[240px] overflow-y-auto kk-scrollbar">
        {parts.map((id, i) => (
          <div key={id} id={id} className={`flex h-[240px] items-center justify-center text-text-secondary ${colors[i]}`}>
            Part {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
