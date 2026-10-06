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
    <Splitter layout="vertical" className="h-[300px] rounded-lg bg-bg-container shadow-kk-tertiary">
      <SplitterPanel>
        <Desc text="First" />
      </SplitterPanel>
      <SplitterPanel>
        <Desc text="Second" />
      </SplitterPanel>
    </Splitter>
  );
}
