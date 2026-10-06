import { Masonry } from "@/components/ui/masonry";

const cards = [
  { height: 128, tone: "bg-primary-bg text-primary border-primary/20", title: "Quick note" },
  { height: 192, tone: "bg-success-bg text-success border-success/20", title: "Task list" },
  { height: 160, tone: "bg-info-bg text-info border-info/20", title: "Diagram" },
  { height: 224, tone: "bg-warning-bg text-warning border-warning/20", title: "Meeting minutes" },
  { height: 144, tone: "bg-error-bg text-error border-error/20", title: "Bug summary" },
  { height: 176, tone: "bg-fill-tertiary text-text border-border", title: "Analytics" },
];

export default function Basic() {
  return (
    <Masonry columns={3} gap={16}>
      {cards.map((c, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between rounded-lg border p-4 ${c.tone}`}
          style={{ height: c.height }}
        >
          <span className="text-sm font-semibold">{c.title}</span>
          <span className="text-xs opacity-75">{c.height}px</span>
        </div>
      ))}
    </Masonry>
  );
}
