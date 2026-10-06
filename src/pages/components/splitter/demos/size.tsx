import { Splitter, SplitterPanel } from "@/components/ui/splitter";

function Desc({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-secondary">
      {text}
    </div>
  );
}

export default function Demo() {
  return (
    <Splitter className="h-[200px] rounded-lg bg-bg-container shadow-kk-tertiary">
      <SplitterPanel defaultSize={120} min={80} max={200}>
        <Desc text="min 80 / max 200" />
      </SplitterPanel>
      <SplitterPanel min="30%">
        <Desc text="min 30%" />
      </SplitterPanel>
      <SplitterPanel>
        <Desc text="auto" />
      </SplitterPanel>
    </Splitter>
  );
}
