import { useState } from "react";
import { Rate } from "@/components/ui/rate";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

export default function Demo() {
  const [value, setValue] = useState(3);

  return (
    <div className="flex items-center gap-3">
      <Rate tooltips={desc} onChange={setValue} value={value} />
      {value ? <span className="text-sm text-text-secondary">{desc[value - 1]}</span> : null}
    </div>
  );
}
