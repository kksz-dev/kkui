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
      <SplitterPanel collapsible>
        <Desc text="First" />
      </SplitterPanel>
      <SplitterPanel collapsible={{ start: true }}>
        <Desc text="Second" />
      </SplitterPanel>
      <SplitterPanel>
        <Desc text="Third" />
      </SplitterPanel>
    </Splitter>
  );
}
