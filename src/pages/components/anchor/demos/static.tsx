import { useRef } from "react";
import { Anchor } from "@/components/ui/anchor";

const parts = ["s-part-1", "s-part-2", "s-part-3"];

export default function Demo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="flex gap-6">
      <div ref={container} className="h-[240px] flex-1 overflow-y-auto rounded-md border border-border-secondary kk-scrollbar">
        {parts.map((id, i) => (
          <div key={id} id={id} className="flex h-[240px] items-center justify-center border-b border-border-secondary text-text-secondary last:border-b-0">
            Part {i + 1}
          </div>
        ))}
      </div>
      <Anchor
        affix={false}
        showInkInFixed
        getContainer={() => container.current}
        items={[
          { key: "1", href: "#s-part-1", title: "Part 1" },
          {
            key: "2",
            href: "#s-part-2",
            title: "Part 2",
            children: [{ key: "2-1", href: "#s-part-3", title: "Nested link" }],
          },
        ]}
      />
    </div>
  );
}
