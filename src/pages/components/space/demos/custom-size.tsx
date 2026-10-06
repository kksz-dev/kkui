import { useState } from "react";
import { Space } from "@/components/ui/space";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [size, setSize] = useState(8);
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3 text-sm">
        Gap
        <input type="range" min={0} max={48} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-56 accent-primary" />
        <span className="w-8 text-text-secondary">{size}px</span>
      </label>
      <Space size={[size, 16]} wrap>
        {Array.from({ length: 20 }, (_, i) => (
          <Button key={i}>Button</Button>
        ))}
      </Space>
    </div>
  );
}
