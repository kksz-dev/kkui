import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal — fades + lifts its child into view the first time it is scrolled to.
 * CSS does the animation (see `kk-reveal` in index.css); JS only flips a flag.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  /** ms */
  delay?: number;
  as?: ElementType;
  /** how much of the element must be visible (0–1) */
  amount?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        // a block taller than the viewport can never reach `amount` visible — reveal it on entry
        const tall = entry.boundingClientRect.height > window.innerHeight;
        if (entry.intersectionRatio >= amount || tall) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: [0, amount], rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return (
    <Tag ref={ref} data-shown={shown} style={{ "--kk-delay": `${delay}ms` } as React.CSSProperties} className={cn("kk-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Entrance animation played once on mount (no scroll needed). */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "zoom" | "none";
  as?: ElementType;
}) {
  return (
    <Tag
      style={{ "--kk-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(
        "kk-in",
        direction === "up" && "kk-in-up",
        direction === "down" && "kk-in-down",
        direction === "zoom" && "kk-in-zoom",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Re-runs a mount animation whenever `trigger` changes (used for route transitions). */
export function PageTransition({ trigger, children }: { trigger: string; children: ReactNode }) {
  return (
    <div key={trigger} className="kk-in kk-in-up">
      {children}
    </div>
  );
}
