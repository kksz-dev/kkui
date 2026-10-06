import { useState } from "react";
import { Splitter, SplitterPanel } from "@/components/ui/splitter";
import { Button } from "@/components/ui/button";

function Desc({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-secondary">
      {text}
    </div>
  );
}

export default function Demo() {
  const [sizes, setSizes] = useState<(number | string)[]>(["50%", "50%"]);
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Splitter
        className="h-[200px] rounded-lg bg-bg-container shadow-kk-tertiary"
        onResize={setSizes}
      >
        <SplitterPanel size={sizes[0]} resizable={enabled}>
          <Desc text="First" />
        </SplitterPanel>
        <SplitterPanel size={sizes[1]}>
          <Desc text="Second" />
        </SplitterPanel>
      </Splitter>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm">Resizable:</span>
        <Button size="sm" onClick={() => setEnabled((v) => !v)}>
          {enabled ? "Disable" : "Enable"}
        </Button>
        <Button size="sm" onClick={() => setSizes(["50%", "50%"])}>
          Reset
        </Button>
        <span className="font-mono text-xs text-text-tertiary">
          {sizes.map((s) => (typeof s === "number" ? Math.round(s) : s)).join(" / ")}
        </span>
      </div>
    </div>
  );
}
