import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

const EVENTS: Record<number, { text: string; status: "success" | "warning" | "error" }[]> = {
  8: [{ text: "Release 2.4", status: "success" }],
  12: [
    { text: "Design review", status: "warning" },
    { text: "Retro", status: "success" },
  ],
  19: [{ text: "Incident drill", status: "error" }],
};

export default function CellRenderDemo() {
  return (
    <Calendar
      defaultValue={dayjs()}
      cellRender={(date, info) => {
        if (info.type !== "month" || !date.isSame(dayjs(), "month")) return null;
        const items = EVENTS[date.date()];
        if (!items) return null;
        return (
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.text}>
                <Badge status={item.status} text={<span className="text-[11px]">{item.text}</span>} />
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
}
