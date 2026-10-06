import * as React from "react";
import { ChevronDown, ChevronRight, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";

export type GanttColor = "primary" | "success" | "warning" | "error" | "purple";
export type GanttScale = "day" | "week" | "month";

export interface GanttTask {
  id: string;
  name: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD — inclusive */
  endDate: string;
  /** 0 – 100 */
  progress?: number;
  color?: GanttColor;
  /** Ids this task waits for; drawn as arrows when `showDependencies`. */
  dependencies?: string[];
  /** Parent task id — turns the chart into a tree. */
  parentId?: string;
  /** Draw as a single diamond instead of a bar. */
  milestone?: boolean;
}

export interface GanttProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tasks: GanttTask[];
  /** First day on the timeline; defaults to the earliest task start. */
  startDate?: string;
  /** Timeline length; defaults to the span covering every task. */
  totalDays?: number;
  scale?: GanttScale;
  onScaleChange?: (scale: GanttScale) => void;
  /** Pixel width of a single day at `scale: "day"`. */
  dayWidth?: number;
  sidebarWidth?: number;
  rowHeight?: number;
  showDependencies?: boolean;
  /** Allow bars to be dragged and resized. */
  editable?: boolean;
  onTaskClick?: (task: GanttTask) => void;
  onTaskChange?: (task: GanttTask, next: { startDate: string; endDate: string }) => void;
  className?: string;
}

const BAR_COLOR: Record<GanttColor, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  purple: "bg-purple",
};

const MILESTONE_COLOR: Record<GanttColor, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  purple: "text-purple",
};

const SCALE_DAY_WIDTH: Record<GanttScale, number> = { day: 40, week: 14, month: 6 };

function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

/** Whole days between two local dates — no UTC round-trip, so no off-by-one. */
function dayDiff(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Gantt({
  tasks,
  startDate,
  totalDays,
  scale: scaleProp,
  onScaleChange,
  dayWidth: dayWidthProp,
  sidebarWidth = 240,
  rowHeight = 40,
  showDependencies = true,
  editable = false,
  onTaskClick,
  onTaskChange,
  className,
  ...props
}: GanttProps) {
  const [internalScale, setInternalScale] = React.useState<GanttScale>("day");
  const scale = scaleProp ?? internalScale;
  const dayWidth = dayWidthProp ?? SCALE_DAY_WIDTH[scale];

  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  /** live drag preview, keyed by task id */
  const [draft, setDraft] = React.useState<Record<string, { startDate: string; endDate: string }>>({});

  const setScale = (next: GanttScale) => {
    if (scaleProp === undefined) setInternalScale(next);
    onScaleChange?.(next);
  };

  const effective = (task: GanttTask) => ({ ...task, ...draft[task.id] });

  // ---------------------------------------------------------------- timeline
  const base = React.useMemo(() => {
    if (startDate) return fromKey(startDate);
    const earliest = tasks.reduce<Date | null>((min, t) => {
      const d = fromKey(t.startDate);
      return !min || d < min ? d : min;
    }, null);
    return earliest ? addDays(earliest, -1) : new Date();
  }, [startDate, tasks]);

  const days = React.useMemo(() => {
    if (totalDays) return totalDays;
    const latest = tasks.reduce<Date | null>((max, t) => {
      const d = fromKey(t.endDate);
      return !max || d > max ? d : max;
    }, null);
    return latest ? Math.max(7, dayDiff(base, latest) + 3) : 30;
  }, [totalDays, tasks, base]);

  const timelineWidth = days * dayWidth;
  const todayOffset = dayDiff(base, new Date());

  /** Grouped header cells above the day ruler: months, or weeks at day scale. */
  const groups = React.useMemo(() => {
    const out: { label: string; span: number }[] = [];
    for (let i = 0; i < days; i++) {
      const date = addDays(base, i);
      const label =
        scale === "day"
          ? `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
          : scale === "week"
            ? `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
            : `${date.getFullYear()}`;
      const last = out.at(-1);
      if (last && last.label === label) last.span += 1;
      else out.push({ label, span: 1 });
    }
    return out;
  }, [base, days, scale]);

  // ---------------------------------------------------------------- tree rows
  const rows = React.useMemo(() => {
    const children = new Map<string | undefined, GanttTask[]>();
    for (const task of tasks) {
      const parent = task.parentId;
      if (!children.has(parent)) children.set(parent, []);
      children.get(parent)!.push(task);
    }
    const known = new Set(tasks.map((t) => t.id));
    const roots = tasks.filter((t) => !t.parentId || !known.has(t.parentId));

    const walk = (list: GanttTask[], depth: number): { task: GanttTask; depth: number; hasChildren: boolean }[] =>
      list.flatMap((task) => {
        const kids = children.get(task.id) ?? [];
        const row = { task, depth, hasChildren: kids.length > 0 };
        if (collapsed.has(task.id) || kids.length === 0) return [row];
        return [row, ...walk(kids, depth + 1)];
      });

    return walk(roots, 0);
  }, [tasks, collapsed]);

  const rowIndexById = React.useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r, i) => map.set(r.task.id, i));
    return map;
  }, [rows]);

  // ---------------------------------------------------------------- dragging
  const dragRef = React.useRef<{
    id: string;
    mode: "move" | "resize-start" | "resize-end";
    startX: number;
    from: { startDate: string; endDate: string };
  } | null>(null);

  const beginDrag = (e: React.PointerEvent, task: GanttTask, mode: "move" | "resize-start" | "resize-end") => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    const current = effective(task);
    dragRef.current = {
      id: task.id,
      mode,
      startX: e.clientX,
      from: { startDate: current.startDate, endDate: current.endDate },
    };

    const onMove = (ev: PointerEvent) => {
      const st = dragRef.current;
      if (!st) return;
      const delta = Math.round((ev.clientX - st.startX) / dayWidth);
      if (delta === 0) {
        setDraft((prev) => {
          if (!prev[st.id]) return prev;
          const next = { ...prev };
          delete next[st.id];
          return next;
        });
        return;
      }
      const start = fromKey(st.from.startDate);
      const end = fromKey(st.from.endDate);
      let nextStart = start;
      let nextEnd = end;
      if (st.mode === "move") {
        nextStart = addDays(start, delta);
        nextEnd = addDays(end, delta);
      } else if (st.mode === "resize-start") {
        nextStart = addDays(start, Math.min(delta, dayDiff(start, end)));
      } else {
        nextEnd = addDays(end, Math.max(delta, -dayDiff(start, end)));
      }
      setDraft((prev) => ({ ...prev, [st.id]: { startDate: toKey(nextStart), endDate: toKey(nextEnd) } }));
    };

    const onUp = () => {
      const st = dragRef.current;
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!st) return;
      setDraft((prev) => {
        const next = prev[st.id];
        if (next && (next.startDate !== st.from.startDate || next.endDate !== st.from.endDate)) {
          const task = tasks.find((t) => t.id === st.id);
          if (task) onTaskChange?.(task, next);
        }
        const cleaned = { ...prev };
        delete cleaned[st.id];
        return cleaned;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // ---------------------------------------------------------------- geometry
  const barGeometry = (task: GanttTask) => {
    const current = effective(task);
    const offset = dayDiff(base, fromKey(current.startDate));
    const span = Math.max(1, dayDiff(fromKey(current.startDate), fromKey(current.endDate)) + 1);
    return { left: offset * dayWidth, width: span * dayWidth };
  };

  const dependencyPaths = React.useMemo(() => {
    if (!showDependencies) return [];
    const paths: { id: string; d: string }[] = [];
    for (const { task } of rows) {
      const toIndex = rowIndexById.get(task.id);
      if (toIndex === undefined) continue;
      for (const depId of task.dependencies ?? []) {
        const from = tasks.find((t) => t.id === depId);
        const fromIndex = rowIndexById.get(depId);
        if (!from || fromIndex === undefined) continue;
        const a = barGeometry(from);
        const b = barGeometry(task);
        const x1 = a.left + a.width;
        const y1 = fromIndex * rowHeight + rowHeight / 2;
        const x2 = b.left;
        const y2 = toIndex * rowHeight + rowHeight / 2;
        const mid = x1 + Math.max(10, (x2 - x1) / 2);
        paths.push({ id: `${depId}->${task.id}`, d: `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}` });
      }
    }
    return paths;
  }, [showDependencies, rows, rowIndexById, tasks, draft, dayWidth, rowHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      data-slot="gantt"
      className={cn(
        "flex select-none flex-col overflow-hidden rounded-xl border border-border bg-bg-container shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-bg-layout px-3 py-2">
        <span className="text-xs font-semibold text-text-secondary">
          {rows.length} task{rows.length === 1 ? "" : "s"}
        </span>
        <div className="inline-flex rounded-lg border border-border bg-bg-container p-0.5 text-xs">
          {(["day", "week", "month"] as GanttScale[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={scale === s}
              onClick={() => setScale(s)}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium capitalize transition-colors",
                scale === s ? "bg-primary text-white" : "text-text-secondary hover:text-text",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* one scroll container keeps the ruler and the bars in lockstep */}
      <div className="kk-scrollbar overflow-x-auto">
        <div style={{ width: sidebarWidth + timelineWidth }}>
          <div className="flex border-b border-border bg-bg-layout text-xs font-semibold text-text-secondary">
            <div
              className="sticky left-0 z-20 shrink-0 border-r border-border bg-bg-layout p-3"
              style={{ width: sidebarWidth }}
            >
              Task
            </div>
            <div style={{ width: timelineWidth }}>
              <div className="flex border-b border-border-secondary">
                {groups.map((group, i) => (
                  <div
                    key={`${group.label}-${i}`}
                    className="shrink-0 border-r border-border-secondary py-1 text-center text-[10px] uppercase tracking-wide text-text-tertiary"
                    style={{ width: group.span * dayWidth }}
                  >
                    {group.span * dayWidth > 48 ? group.label : ""}
                  </div>
                ))}
              </div>
              <div className="flex">
                {Array.from({ length: days }).map((_, idx) => {
                  const d = addDays(base, idx);
                  const weekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "shrink-0 border-r border-border-secondary py-1 text-center text-[10px]",
                        weekend && "bg-fill-tertiary/40",
                      )}
                      style={{ width: dayWidth }}
                    >
                      {dayWidth >= 24 ? d.getDate() : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative flex">
            <div className="sticky left-0 z-20 shrink-0 border-r border-border bg-bg-container" style={{ width: sidebarWidth }}>
              {rows.map(({ task, depth, hasChildren }) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2 border-b border-border-secondary px-3 text-xs"
                  style={{ height: rowHeight, paddingLeft: 12 + depth * 14 }}
                >
                  <span className="flex min-w-0 items-center gap-1">
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-label={collapsed.has(task.id) ? "Expand" : "Collapse"}
                        onClick={() =>
                          setCollapsed((prev) => {
                            const next = new Set(prev);
                            if (next.has(task.id)) next.delete(task.id);
                            else next.add(task.id);
                            return next;
                          })
                        }
                        className="text-text-tertiary hover:text-text"
                      >
                        {collapsed.has(task.id) ? (
                          <ChevronRight className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )}
                      </button>
                    ) : (
                      <span className="w-3.5" />
                    )}
                    <span className="truncate font-medium text-text">{task.name}</span>
                  </span>
                  {!task.milestone && (
                    <span className="shrink-0 font-mono text-[11px] text-text-tertiary">{task.progress ?? 0}%</span>
                  )}
                </div>
              ))}
            </div>

            <div className="relative" style={{ width: timelineWidth, height: rows.length * rowHeight }}>
              {/* day grid + weekend shading */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: days }).map((_, idx) => {
                  const d = addDays(base, idx);
                  const weekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={idx}
                      className={cn("h-full shrink-0 border-r border-border-secondary", weekend && "bg-fill-tertiary/30")}
                      style={{ width: dayWidth }}
                    />
                  );
                })}
              </div>

              {todayOffset >= 0 && todayOffset < days && (
                <div
                  className="pointer-events-none absolute inset-y-0 z-10 w-px bg-error/70"
                  style={{ left: todayOffset * dayWidth + dayWidth / 2 }}
                />
              )}

              {showDependencies && dependencyPaths.length > 0 && (
                <svg
                  className="pointer-events-none absolute inset-0 z-10 overflow-visible"
                  width={timelineWidth}
                  height={rows.length * rowHeight}
                  aria-hidden
                >
                  <defs>
                    <marker id="kk-gantt-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" className="fill-text-quaternary" />
                    </marker>
                  </defs>
                  {dependencyPaths.map((p) => (
                    <path
                      key={p.id}
                      d={p.d}
                      className="fill-none stroke-text-quaternary"
                      strokeWidth="1.5"
                      markerEnd="url(#kk-gantt-arrow)"
                    />
                  ))}
                </svg>
              )}

              {rows.map(({ task }, rowIdx) => {
                const { left, width } = barGeometry(task);
                const progress = Math.min(100, Math.max(0, task.progress ?? 0));
                const color = BAR_COLOR[task.color ?? "primary"];

                if (task.milestone) {
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onTaskClick?.(task)}
                      onPointerDown={(e) => beginDrag(e, task, "move")}
                      title={task.name}
                      className="absolute z-20 flex items-center justify-center"
                      style={{ left: left + dayWidth / 2 - 10, top: rowIdx * rowHeight + rowHeight / 2 - 10 }}
                    >
                      <Diamond className={cn("size-4 fill-current", MILESTONE_COLOR[task.color ?? "primary"])} />
                    </button>
                  );
                }

                return (
                  <div
                    key={task.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onTaskClick?.(task)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onTaskClick?.(task)}
                    onPointerDown={(e) => beginDrag(e, task, "move")}
                    title={`${task.name} · ${effective(task).startDate} → ${effective(task).endDate}`}
                    className={cn(
                      "group absolute z-20 flex items-center overflow-hidden rounded-md px-2 text-xs font-semibold text-white shadow-xs",
                      color,
                      editable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                    )}
                    style={{ left, width, top: rowIdx * rowHeight + (rowHeight - 26) / 2, height: 26 }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 bg-white/25"
                      style={{ width: `${progress}%` }}
                    />
                    <span className="relative z-10 truncate">{task.name}</span>

                    {editable && (
                      <>
                        <span
                          onPointerDown={(e) => beginDrag(e, task, "resize-start")}
                          className="absolute inset-y-0 left-0 z-20 w-1.5 cursor-col-resize opacity-0 transition-opacity group-hover:opacity-100 bg-white/40"
                        />
                        <span
                          onPointerDown={(e) => beginDrag(e, task, "resize-end")}
                          className="absolute inset-y-0 right-0 z-20 w-1.5 cursor-col-resize opacity-0 transition-opacity group-hover:opacity-100 bg-white/40"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
