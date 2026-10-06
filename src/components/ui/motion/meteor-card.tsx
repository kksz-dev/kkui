import * as React from "react";
import { cn } from "@/lib/utils";

export interface MeteorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: number;
  className?: string;
  children: React.ReactNode;
}

/** Deterministic pseudo-random in [0,1) — same output on server and client, stable across renders. */
function seeded(index: number, salt: number) {
  const v = Math.sin((index + 1) * salt) * 10000;
  return v - Math.floor(v);
}

export function MeteorCard({ number = 16, className, children, ...props }: MeteorCardProps) {
  const meteors = React.useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        left: Math.floor(seeded(i, 12.9898) * 800) - 400,
        delay: seeded(i, 78.233) * 0.6 + 0.2,
        duration: Math.floor(seeded(i, 43.7585) * 8) + 2,
      })),
    [number],
  );

  return (
    <div
      data-slot="meteor-card"
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-bg-container p-6 shadow-kk",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {meteors.map((m, idx) => (
          <span
            key={idx}
            style={{
              top: 0,
              left: `${m.left}px`,
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.duration}s`,
            }}
            className={cn(
              "absolute h-0.5 w-0.5 rotate-[215deg] animate-[meteor_5s_linear_infinite] rounded-[9999px] bg-text-quaternary shadow-[0_0_0_1px_var(--kk-fill-quaternary)]",
              "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-primary before:to-transparent",
            )}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
