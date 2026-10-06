import { useState } from "react";
import { Divider, type DividerProps } from "@/components/ui/divider";

const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.";

export default function Demo() {
  const [size, setSize] = useState<NonNullable<DividerProps["size"]>>("md");
  return (
    <>
      <div className="mb-4 inline-flex self-start rounded-md border border-border p-0.5">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`rounded-sm px-4 py-1.5 text-sm ${size === s ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
          >
            {s === "sm" ? "Small" : s === "md" ? "Middle" : "Large"}
          </button>
        ))}
      </div>
      <p>{text}</p>
      <Divider size={size} />
      <p>{text}</p>
      <Divider size={size} dashed>
        Text
      </Divider>
      <p>{text}</p>
    </>
  );
}
