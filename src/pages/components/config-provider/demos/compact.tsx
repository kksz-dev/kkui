import { ConfigProvider, compactAlgorithm } from "@/components/ui/config-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompactDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs text-text-tertiary">default</span>
        <Button type="primary">Button</Button>
        <Input placeholder="Input" className="w-40" />
      </div>

      <ConfigProvider theme={{ algorithm: compactAlgorithm }} applyToRoot={false}>
        <div className="flex items-center gap-3">
          <span className="w-20 text-xs text-text-tertiary">compact</span>
          <Button type="primary">Button</Button>
          <Input placeholder="Input" className="w-40" />
        </div>
      </ConfigProvider>
    </div>
  );
}
