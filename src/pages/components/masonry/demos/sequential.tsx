import { Masonry } from "@/components/ui/masonry";

const HEIGHTS = [80, 150, 60, 120, 100, 180, 70, 140];

export default function SequentialDemo() {
  return (
    <Masonry columns={3} gap={10} sequential>
      {HEIGHTS.map((height, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-lg border border-border bg-bg-layout text-xs font-medium text-text-secondary"
          style={{ height }}
        >
          Item {i + 1}
        </div>
      ))}
    </Masonry>
  );
}
