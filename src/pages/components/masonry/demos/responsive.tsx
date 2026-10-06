import { Masonry } from "@/components/ui/masonry";
import { Card } from "@/components/ui/card";

const HEIGHTS = [140, 96, 210, 120, 170, 90, 240, 130, 110, 190];

export default function ResponsiveDemo() {
  return (
    <Masonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={12}>
      {HEIGHTS.map((height, i) => (
        <Card key={i} size="small" title={`Card ${i + 1}`}>
          <div className="flex items-end text-xs text-text-tertiary" style={{ height }}>
            {height}px tall
          </div>
        </Card>
      ))}
    </Masonry>
  );
}
