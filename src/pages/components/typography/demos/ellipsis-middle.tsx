import { TypographyText as Text } from "@/components/ui/typography";

const path = "/home/dev/projects/kkui/src/components/ui/typography.tsx";

/** The last `suffixCount` characters stay visible; everything before them is ellipsized. */
function EllipsisMiddle({ suffixCount, children }: { suffixCount: number; children: string }) {
  const start = children.slice(0, children.length - suffixCount);
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Text className="w-full" ellipsis={{ suffix, tooltip: children }}>
      {start}
    </Text>
  );
}

export default function Demo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <EllipsisMiddle suffixCount={14}>{path}</EllipsisMiddle>
      <Text className="w-full" ellipsis={{ suffix: " (2026)" }}>
        A very long headline that keeps its trailing year visible no matter how narrow the column becomes
      </Text>
    </div>
  );
}
