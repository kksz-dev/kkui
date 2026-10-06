import { useState } from "react";
import { Download } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export default function Demo() {
  const [size, setSize] = useState<NonNullable<ButtonProps["size"]>>("lg");
  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-md border border-border p-0.5">
        {(["lg", "md", "sm"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`rounded-sm px-4 py-1.5 text-sm ${size === s ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
          >
            {s === "lg" ? "Large" : s === "md" ? "Default" : "Small"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="primary" size={size}>Primary</Button>
        <Button size={size}>Default</Button>
        <Button type="dashed" size={size}>Dashed</Button>
        <Button type="link" size={size}>Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="primary" icon={<Download />} size={size} />
        <Button type="primary" shape="circle" icon={<Download />} size={size} />
        <Button type="primary" shape="round" icon={<Download />} size={size}>Download</Button>
        <Button type="primary" shape="round" icon={<Download />} size={size} />
        <Button type="primary" icon={<Download />} size={size}>Download</Button>
      </div>
    </div>
  );
}
