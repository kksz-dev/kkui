import { useRef, useState } from "react";
import { Anchor } from "@/components/ui/anchor";

const parts = ["c-part-1", "c-part-2", "c-part-3"];

export default function Demo() {
  const container = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState("-");

  return (
    <div className="flex flex-col gap-3">
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
          getContainer={() => container.current}
          onClick={(e, link) => {
            e.preventDefault(); // stop the default scroll — handle it yourself
            setClicked(link.href);
          }}
          items={parts.map((id, i) => ({ key: id, href: `#${id}`, title: `Part ${i + 1}` }))}
        />
      </div>
      <div className="text-sm text-text-secondary">
        clicked: <span className="font-mono">{clicked}</span>
      </div>
    </div>
  );
}
