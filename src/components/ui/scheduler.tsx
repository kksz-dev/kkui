import * as React from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export type SchedulerView = "month" | "week" | "day" | "agenda";

export interface SchedulerEvent {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD — inclusive; defaults to `startDate`. */
  endDate?: string;
  /** HH:mm — omit for an all-day event. */
  startTime?: string;
  endTime?: string;
  color?: SchedulerEventColor;
  description?: string;
}

export type SchedulerEventColor = "primary" | "success" | "warning" | "error" | "purple";

export interface SchedulerLocale {
  months: string[];
  weekDays: string[];
  today: string;
  newEvent: string;
  allDay: string;
  views: Record<SchedulerView, string>;
  emptyAgenda: string;
  titleLabel: string;
  titlePlaceholder: string;
  deleteLabel: string;
}

export const DEFAULT_SCHEDULER_LOCALE: SchedulerLocale = {
  months: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
  newEvent: "New Event",
  allDay: "All day",
  views: { month: "Month", week: "Week", day: "Day", agenda: "Agenda" },
  emptyAgenda: "Nothing scheduled",
  titleLabel: "Event Title",
  titlePlaceholder: "e.g. Design Sync, Client Meeting...",
  deleteLabel: "Delete",
};

export interface SchedulerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled event list. */
  events?: SchedulerEvent[];
  defaultEvents?: SchedulerEvent[];
  view?: SchedulerView;
  defaultView?: SchedulerView;
  onViewChange?: (view: SchedulerView) => void;
  /** Controlled focus date (YYYY-MM-DD or Date). */
  date?: string | Date;
  defaultDate?: string | Date;
  onDateChange?: (date: string) => void;
  onEventAdd?: (event: SchedulerEvent) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  onEventChange?: (event: SchedulerEvent) => void;
  onEventDelete?: (event: SchedulerEvent) => void;
  /** Clicking an empty cell. Receives YYYY-MM-DD, plus HH:mm in the time grids. */
  onCellClick?: (date: string, time?: string) => void;
  /** Show the New Event button and the edit/delete controls. */
  editable?: boolean;
  /** Hours drawn by the week and day grids. */
  hourRange?: [number, number];
  /** Cap the events listed in a month cell before "+N more". */
  dayMaxEvents?: number;
  locale?: Partial<SchedulerLocale>;
  className?: string;
}

const COLOR_STYLES: Record<SchedulerEventColor, string> = {
  primary: "bg-primary-bg text-primary border-primary/30",
  success: "bg-success-bg text-success border-success/30",
  warning: "bg-warning-bg text-warning border-warning/30",
  error: "bg-error-bg text-error border-error/30",
  purple: "bg-purple-bg text-purple border-purple/30",
};

/* ------------------------------------------------------------------ */
/* date helpers — plain YYYY-MM-DD strings, no timezone surprises      */
/* ------------------------------------------------------------------ */

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(d: Date): Date {
  return addDays(d, -d.getDay());
}

function minutesOf(time?: string): number | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
}

/** Every day an event covers, so a multi-day event shows up on all of them. */
function eventDays(ev: SchedulerEvent): string[] {
  const start = fromKey(ev.startDate);
  const end = ev.endDate ? fromKey(ev.endDate) : start;
  const days: string[] = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) days.push(toKey(cursor));
  return days.length ? days : [ev.startDate];
}

export function Scheduler({
  events: controlledEvents,
  defaultEvents = [],
  view: controlledView,
  defaultView = "month",
  onViewChange,
  date: controlledDate,
  defaultDate,
  onDateChange,
  onEventAdd,
  onEventClick,
  onEventChange,
  onEventDelete,
  onCellClick,
  editable = true,
  hourRange = [7, 20],
  dayMaxEvents = 3,
  locale: localeProp,
  className,
  ...props
}: SchedulerProps) {
  const locale = { ...DEFAULT_SCHEDULER_LOCALE, ...localeProp };

  const [internalEvents, setInternalEvents] = React.useState<SchedulerEvent[]>(defaultEvents);
  const events = controlledEvents ?? internalEvents;

  const [internalView, setInternalView] = React.useState<SchedulerView>(defaultView);
  const view = controlledView ?? internalView;

  const [internalDate, setInternalDate] = React.useState<string>(() =>
    toKey(defaultDate ? (typeof defaultDate === "string" ? fromKey(defaultDate) : defaultDate) : new Date()),
  );
  const focusKey = controlledDate
    ? typeof controlledDate === "string"
      ? controlledDate
      : toKey(controlledDate)
    : internalDate;
  const focusDate = fromKey(focusKey);

  const [draft, setDraft] = React.useState<SchedulerEvent | null>(null);
  const todayKey = toKey(new Date());

  const setView = (next: SchedulerView) => {
    if (controlledView === undefined) setInternalView(next);
    onViewChange?.(next);
  };

  const setFocus = (next: Date) => {
    const key = toKey(next);
    if (controlledDate === undefined) setInternalDate(key);
    onDateChange?.(key);
  };

  const step = (dir: 1 | -1) => {
    if (view === "month") setFocus(new Date(focusDate.getFullYear(), focusDate.getMonth() + dir, 1));
    else if (view === "week") setFocus(addDays(focusDate, dir * 7));
    else if (view === "day") setFocus(addDays(focusDate, dir));
    else setFocus(addDays(focusDate, dir * 30));
  };

  /** date key → events, expanded across multi-day spans and sorted by start time */
  const byDay = React.useMemo(() => {
    const map = new Map<string, SchedulerEvent[]>();
    for (const ev of events) {
      for (const day of eventDays(ev)) {
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(ev);
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => (minutesOf(a.startTime) ?? -1) - (minutesOf(b.startTime) ?? -1));
    }
    return map;
  }, [events]);

  const eventsOn = (key: string) => byDay.get(key) ?? [];

  const commitEvent = (event: SchedulerEvent, mode: "add" | "edit") => {
    if (controlledEvents === undefined) {
      setInternalEvents((prev) =>
        mode === "add" ? [...prev, event] : prev.map((e) => (e.id === event.id ? event : e)),
      );
    }
    if (mode === "add") onEventAdd?.(event);
    else onEventChange?.(event);
    setDraft(null);
  };

  const deleteEvent = (event: SchedulerEvent) => {
    if (controlledEvents === undefined) setInternalEvents((prev) => prev.filter((e) => e.id !== event.id));
    onEventDelete?.(event);
    setDraft(null);
  };

  const openDraft = (date: string, time?: string) => {
    onCellClick?.(date, time);
    if (!editable) return;
    setDraft({ id: "", title: "", startDate: date, startTime: time, color: "primary" });
  };

  const openEvent = (ev: SchedulerEvent) => {
    onEventClick?.(ev);
    if (editable) setDraft(ev);
  };

  const headerLabel = () => {
    if (view === "month") return `${locale.months[focusDate.getMonth()]} ${focusDate.getFullYear()}`;
    if (view === "week") {
      const from = startOfWeek(focusDate);
      const to = addDays(from, 6);
      return `${locale.months[from.getMonth()]} ${from.getDate()} – ${
        from.getMonth() === to.getMonth() ? "" : `${locale.months[to.getMonth()]} `
      }${to.getDate()}, ${to.getFullYear()}`;
    }
    if (view === "day")
      return `${locale.weekDays[focusDate.getDay()]} ${focusDate.getDate()} ${
        locale.months[focusDate.getMonth()]
      } ${focusDate.getFullYear()}`;
    return `${locale.months[focusDate.getMonth()]} ${focusDate.getFullYear()}`;
  };

  const EventChip = ({ ev, className: chipClass }: { ev: SchedulerEvent; className?: string }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openEvent(ev);
      }}
      className={cn(
        "block w-full truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-medium transition-colors",
        COLOR_STYLES[ev.color ?? "primary"],
        chipClass,
      )}
    >
      {ev.startTime ? `${ev.startTime} ` : ""}
      {ev.title}
    </button>
  );

  /* ---------------------------------------------------------------- month */
  const renderMonth = () => {
    const first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    const gridStart = startOfWeek(first);
    const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

    return (
      <>
        <div className="grid grid-cols-7 border-b border-border bg-bg-layout/50 py-2 text-center text-xs font-semibold text-text-tertiary">
          {locale.weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid auto-rows-fr grid-cols-7 divide-x divide-y divide-border-secondary">
          {cells.map((cell) => {
            const key = toKey(cell);
            const dayEvents = eventsOn(key);
            const outside = cell.getMonth() !== focusDate.getMonth();
            const shown = dayEvents.slice(0, dayMaxEvents);
            const hidden = dayEvents.length - shown.length;

            return (
              <div
                key={key}
                onClick={() => openDraft(key)}
                className={cn(
                  "flex min-h-[92px] cursor-pointer flex-col p-2 transition-colors hover:bg-fill-tertiary/30",
                  outside && "bg-bg-layout/30",
                  key === todayKey && "bg-primary-bg/10",
                )}
              >
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full font-medium",
                      key === todayKey ? "bg-primary font-bold text-white" : outside ? "text-text-quaternary" : "text-text",
                    )}
                  >
                    {cell.getDate()}
                  </span>
                </div>

                <div className="kk-scrollbar flex-1 space-y-1 overflow-y-auto">
                  {shown.map((ev) => (
                    <EventChip key={`${ev.id}-${key}`} ev={ev} />
                  ))}
                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocus(cell);
                        setView("day");
                      }}
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      +{hidden} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ------------------------------------------------------- week / day grid */
  const renderTimeGrid = (days: Date[]) => {
    const [fromHour, toHour] = hourRange;
    const hours = Array.from({ length: Math.max(1, toHour - fromHour + 1) }, (_, i) => fromHour + i);
    const rowHeight = 48;
    const gridMinutes = (toHour - fromHour + 1) * 60;

    return (
      <div className="flex flex-col">
        <div className="flex border-b border-border bg-bg-layout/50">
          <div className="w-14 shrink-0 border-r border-border-secondary" />
          {days.map((d) => {
            const key = toKey(d);
            return (
              <div key={key} className="flex-1 py-2 text-center">
                <div className="text-xs font-semibold text-text-tertiary">{locale.weekDays[d.getDay()]}</div>
                <div
                  className={cn(
                    "mx-auto mt-0.5 flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    key === todayKey ? "bg-primary font-bold text-white" : "text-text",
                  )}
                >
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* all-day lane */}
        <div className="flex border-b border-border-secondary">
          <div className="w-14 shrink-0 border-r border-border-secondary px-1 py-1 text-[10px] uppercase text-text-quaternary">
            {locale.allDay}
          </div>
          {days.map((d) => {
            const key = toKey(d);
            const allDay = eventsOn(key).filter((ev) => !ev.startTime);
            return (
              <div
                key={key}
                onClick={() => openDraft(key)}
                className="min-h-8 flex-1 space-y-1 border-l border-border-secondary p-1"
              >
                {allDay.map((ev) => (
                  <EventChip key={`${ev.id}-${key}`} ev={ev} />
                ))}
              </div>
            );
          })}
        </div>

        <div className="kk-scrollbar flex max-h-[520px] overflow-y-auto">
          <div className="w-14 shrink-0 border-r border-border-secondary">
            {hours.map((h) => (
              <div key={h} className="relative text-right" style={{ height: rowHeight }}>
                <span className="pr-1 text-[10px] text-text-quaternary">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {days.map((d) => {
            const key = toKey(d);
            const timed = eventsOn(key).filter((ev) => ev.startTime);
            return (
              <div key={key} className="relative flex-1 border-l border-border-secondary">
                {hours.map((h) => (
                  <div
                    key={h}
                    onClick={() => openDraft(key, `${String(h).padStart(2, "0")}:00`)}
                    className="cursor-pointer border-b border-border-secondary transition-colors hover:bg-fill-tertiary/30"
                    style={{ height: rowHeight }}
                  />
                ))}

                {timed.map((ev) => {
                  const start = minutesOf(ev.startTime) ?? 0;
                  const end = minutesOf(ev.endTime) ?? start + 60;
                  const top = ((start - fromHour * 60) / gridMinutes) * (hours.length * rowHeight);
                  const height = Math.max(18, ((end - start) / gridMinutes) * (hours.length * rowHeight));
                  if (top + height < 0 || top > hours.length * rowHeight) return null;
                  return (
                    <button
                      key={`${ev.id}-${key}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEvent(ev);
                      }}
                      style={{ top: Math.max(0, top), height }}
                      className={cn(
                        "absolute inset-x-1 overflow-hidden rounded border px-1.5 py-0.5 text-left text-[11px] font-medium",
                        COLOR_STYLES[ev.color ?? "primary"],
                      )}
                    >
                      <span className="block truncate">{ev.title}</span>
                      <span className="block truncate text-[10px] opacity-80">
                        {ev.startTime}
                        {ev.endTime ? ` – ${ev.endTime}` : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------- agenda */
  const renderAgenda = () => {
    const from = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    const days = Array.from({ length: new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate() }, (_, i) =>
      addDays(from, i),
    ).filter((d) => eventsOn(toKey(d)).length > 0);

    if (days.length === 0) {
      return <div className="py-16 text-center text-sm text-text-tertiary">{locale.emptyAgenda}</div>;
    }

    return (
      <div className="divide-y divide-border-secondary">
        {days.map((d) => {
          const key = toKey(d);
          return (
            <div key={key} className="flex gap-4 px-4 py-3">
              <div className="w-24 shrink-0">
                <div className={cn("text-sm font-semibold", key === todayKey ? "text-primary" : "text-text-heading")}>
                  {d.getDate()} {locale.months[d.getMonth()].slice(0, 3)}
                </div>
                <div className="text-xs text-text-tertiary">{locale.weekDays[d.getDay()]}</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {eventsOn(key).map((ev) => (
                  <button
                    key={`${ev.id}-${key}`}
                    type="button"
                    onClick={() => openEvent(ev)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs",
                      COLOR_STYLES[ev.color ?? "primary"],
                    )}
                  >
                    <span className="w-24 shrink-0 font-medium">
                      {ev.startTime ? `${ev.startTime}${ev.endTime ? `–${ev.endTime}` : ""}` : locale.allDay}
                    </span>
                    <span className="truncate font-medium">{ev.title}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const weekDays = React.useMemo(() => {
    const from = startOfWeek(focusDate);
    return Array.from({ length: 7 }, (_, i) => addDays(from, i));
  }, [focusKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      data-slot="scheduler"
      className={cn("flex flex-col overflow-hidden rounded-xl border border-border bg-bg-container shadow-xs", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg-layout px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outlined" onClick={() => setFocus(new Date())}>
            {locale.today}
          </Button>
          <Button size="sm" variant="text" aria-label="Previous" icon={<ChevronLeft className="size-4" />} onClick={() => step(-1)} />
          <Button size="sm" variant="text" aria-label="Next" icon={<ChevronRight className="size-4" />} onClick={() => step(1)} />
          <span className="ml-2 text-base font-semibold text-text-heading">{headerLabel()}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-bg-container p-0.5 text-xs">
            {(["month", "week", "day", "agenda"] as SchedulerView[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  view === v ? "bg-primary text-white" : "text-text-secondary hover:text-text",
                )}
              >
                {locale.views[v]}
              </button>
            ))}
          </div>

          {editable && (
            <Button
              size="sm"
              type="primary"
              icon={<Plus className="size-3.5" />}
              onClick={() => setDraft({ id: "", title: "", startDate: focusKey, color: "primary" })}
            >
              {locale.newEvent}
            </Button>
          )}
        </div>
      </div>

      {view === "month" && renderMonth()}
      {view === "week" && renderTimeGrid(weekDays)}
      {view === "day" && renderTimeGrid([focusDate])}
      {view === "agenda" && renderAgenda()}

      <Modal
        open={draft !== null}
        onCancel={() => setDraft(null)}
        onOk={() => {
          if (!draft?.title.trim()) return;
          commitEvent(draft.id ? draft : { ...draft, id: `ev-${Math.round(performance.now())}` }, draft.id ? "edit" : "add");
        }}
        title={draft?.id ? draft.title || locale.titleLabel : locale.newEvent}
        footer={
          draft?.id ? (
            <div className="flex items-center justify-between gap-2">
              <Button size="sm" type="text" danger icon={<Trash2 className="size-3.5" />} onClick={() => deleteEvent(draft)}>
                {locale.deleteLabel}
              </Button>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button size="sm" type="primary" onClick={() => draft && commitEvent(draft, "edit")}>
                  OK
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {draft && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">{locale.titleLabel}</label>
              <Input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder={locale.titlePlaceholder}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Date</label>
                <Input type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Start</label>
                <Input
                  type="time"
                  value={draft.startTime ?? ""}
                  onChange={(e) => setDraft({ ...draft, startTime: e.target.value || undefined })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">End</label>
                <Input
                  type="time"
                  value={draft.endTime ?? ""}
                  onChange={(e) => setDraft({ ...draft, endTime: e.target.value || undefined })}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
