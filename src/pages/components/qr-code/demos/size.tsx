import * as React from "react";
import { QRCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function Demo() {
  const [size, setSize] = React.useState(160);

  const increase = () => setSize((prev) => Math.min(prev + 20, 260));
  const decrease = () => setSize((prev) => Math.max(prev - 20, 100));

  return (
    <div className="space-y-4">
      <QRCode value="https://kkui.kksz.dev/" size={size} />
      <div className="flex items-center gap-2">
        <Button size="sm" icon={<Minus className="size-3.5" />} onClick={decrease} disabled={size <= 100}>
          Smaller
        </Button>
        <span className="text-xs text-text-secondary font-mono">{size}px</span>
        <Button size="sm" icon={<Plus className="size-3.5" />} onClick={increase} disabled={size >= 260}>
          Larger
        </Button>
      </div>
    </div>
  );
}
