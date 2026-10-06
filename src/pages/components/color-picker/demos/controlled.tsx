import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  const [color, setColor] = useState("#52c41a");

  return (
    <div className="flex items-center gap-4">
      <ColorPicker value={color} onChange={setColor} showText />
      <span className="text-sm text-text-secondary">
        Selected: <code className="font-mono text-text">{color}</code>
      </span>
    </div>
  );
}
