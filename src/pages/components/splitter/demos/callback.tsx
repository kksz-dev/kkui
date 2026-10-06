import { useState } from "react";
import { Splitter, SplitterPanel } from "@/components/ui/splitter";

function Desc({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-secondary">
      {text}
    </div>
  );
}

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 5));
  const fmt = (s: number[]) => s.map((n) => Math.round(n)).join(", ");

  return (
    <div className="flex flex-col gap-3">
      <Splitter
        className="h-[200px] rounded-lg bg-bg-container shadow-kk-tertiary"
        onResizeStart={(s) => push(`start  [${fmt(s)}]`)}
        onResize={(s) => push(`resize [${fmt(s)}]`)}
        onResizeEnd={(s) => push(`end    [${fmt(s)}]`)}
      >
        <SplitterPanel>
          <Desc text="First" />
        </SplitterPanel>
        <SplitterPanel>
          <Desc text="Second" />
        </SplitterPanel>
      </Splitter>
      <pre className="h-24 overflow-hidden rounded-md bg-fill-quaternary p-2 font-mono text-xs text-text-secondary">
        {log.length ? log.join("\n") : "Drag the bar to see events..."}
      </pre>
    </div>
  );
}
