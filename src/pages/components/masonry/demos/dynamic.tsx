import { useState } from "react";
import { Masonry } from "@/components/ui/masonry";
import { Button } from "@/components/ui/button";

const NOTES = [
  { title: "Deploy window", body: "Friday 18:00 after the last batch job. Page the on-call if the health check stays red for more than two minutes." },
  { title: "Retro", body: "Keep the demo short." },
  { title: "Onboarding", body: "Laptop, badge, VPN, repo access, and a buddy for the first week. Schedule the security briefing before day three." },
  { title: "Budget", body: "Q3 numbers are in; the cloud bill is up 12%, mostly storage for the analytics warehouse." },
  { title: "Design review", body: "New empty states." },
  { title: "Incident #42", body: "Queue backed up after a schema change; replayed 9,000 events. Postmortem is in the wiki, action items are tracked as tickets." },
];

export default function DynamicDemo() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Masonry columns={2} gap={12}>
      {NOTES.map((note, i) => {
        const expanded = open === i;
        return (
          <div key={i} className="rounded-lg border border-border bg-bg-container p-3 text-sm">
            <div className="font-medium text-text-heading">{note.title}</div>
            <p className={`mt-1 text-text-secondary ${expanded ? "" : "line-clamp-1"}`}>{note.body}</p>
            <Button type="link" size="sm" className="mt-1 px-0" onClick={() => setOpen(expanded ? null : i)}>
              {expanded ? "Show less" : "Show more"}
            </Button>
          </div>
        );
      })}
    </Masonry>
  );
}
