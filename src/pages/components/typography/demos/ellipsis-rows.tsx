import { useState } from "react";
import { TypographyParagraph as Paragraph } from "@/components/ui/typography";

const article =
  "To be, or not to be, that is a question: Whether it is nobler in the mind to suffer. The slings and arrows of outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. There's the respect That makes calamity of so long life.";

export default function Demo() {
  const [rows, setRows] = useState(1);
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm">
        Rows
        <input type="range" min={1} max={10} value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-56 accent-primary" />
        <span className="w-4 text-text-secondary">{rows}</span>
      </label>
      <Paragraph
        ellipsis={{
          rows,
          expandable: true,
          symbol: (expanded) => (expanded ? "less" : "more"),
          onEllipsis: () => undefined,
        }}
        copyable
      >
        {article}
      </Paragraph>
    </div>
  );
}
