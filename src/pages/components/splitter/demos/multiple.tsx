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
    <Splitter className="h-[300px] rounded-lg bg-bg-container shadow-kk-tertiary">
      <SplitterPanel collapsible>
        <Desc text="Left" />
      </SplitterPanel>
      <SplitterPanel>
        <Splitter layout="vertical">
          <SplitterPanel>
            <Desc text="Top" />
          </SplitterPanel>
          <SplitterPanel>
            <Desc text="Bottom" />
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  );
}
