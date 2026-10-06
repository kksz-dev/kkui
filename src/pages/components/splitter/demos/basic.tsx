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
      <SplitterPanel defaultSize="40%" min="20%" max="70%">
        <Desc text="First" />
      </SplitterPanel>
      <SplitterPanel>
        <Desc text="Second" />
      </SplitterPanel>
    </Splitter>
  );
}
