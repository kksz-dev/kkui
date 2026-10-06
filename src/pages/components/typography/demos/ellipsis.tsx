import { useState } from "react";
import { TypographyParagraph as Paragraph, TypographyText as Text } from "@/components/ui/typography";

const article =
  "KKUI, a design language for background applications, is refined by Ant Group. KKUI, a design language for background applications, is refined by Ant Group. KKUI, a design language for background applications, is refined by Ant Group. KKUI, a design language for background applications, is refined by Ant Group. KKUI, a design language for background applications, is refined by Ant Group. KKUI, a design language for background applications, is refined by Ant Group.";

export default function Demo() {
  const [ellipsis, setEllipsis] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={ellipsis} onChange={(e) => setEllipsis(e.target.checked)} />
        Ellipsis
      </label>
      <Paragraph ellipsis={ellipsis}>{article}</Paragraph>
      <Paragraph ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: "more" } : false}>{article}</Paragraph>
      <Paragraph ellipsis={ellipsis ? { rows: 3, expandable: "collapsible" } : false}>{article}</Paragraph>
      <Text className="w-full" ellipsis={ellipsis ? { tooltip: article } : false}>
        {article}
      </Text>
    </div>
  );
}
