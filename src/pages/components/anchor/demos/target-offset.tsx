import { useRef } from "react";
import { Anchor } from "@/components/ui/anchor";

const parts = ["t-part-1", "t-part-2", "t-part-3"];

export default function Demo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="flex gap-6">
      <div ref={container} className="h-[200px] flex-1 overflow-y-auto rounded-md border border-border-secondary kk-scrollbar">
        {parts.map((id, i) => (
          <div key={id} id={id} className="flex h-[200px] items-center justify-center border-b border-border-secondary text-text-secondary last:border-b-0">
            Part {i + 1}
          </div>
        ))}
      </div>
      <Anchor
        affix={false}
        targetOffset={40}
        getContainer={() => container.current}
        items={parts.map((id, i) => ({ key: id, href: `#${id}`, title: `Part ${i + 1}` }))}
      />
    </div>
  );
}
