import { Portal } from "@/components/ui/portal";

export default function SelectorDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-tertiary">#kkui-portal-selector-host</p>
      <div id="kkui-portal-selector-host" className="min-h-8 rounded-md border border-border p-3" />

      <Portal container="#kkui-portal-selector-host">
        <span className="rounded-sm bg-success-bg px-2 py-0.5 text-xs text-success">via CSS selector</span>
      </Portal>
    </div>
  );
}
