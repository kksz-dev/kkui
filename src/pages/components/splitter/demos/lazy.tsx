import { useState } from "react";
import { Splitter, SplitterPanel } from "@/components/ui/splitter";

function Desc({ text }: { text: string }) {
  return <div className="flex h-full items-center justify-center text-sm text-text-secondary">{text}</div>;
}

export default function Demo() {
  const [lazy, setLazy] = useState(true);

  return (
    <div className="flex flex-col gap-3">
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={lazy} onChange={(e) => setLazy(e.target.checked)} />
        Lazy
      </label>
      <Splitter lazy={lazy} className="h-[200px] rounded-lg bg-bg-container shadow-kk-tertiary">
        <SplitterPanel defaultSize="50%" min="20%" max="80%">
          <Desc text="First" />
        </SplitterPanel>
        <SplitterPanel>
          <Desc text="Second" />
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
