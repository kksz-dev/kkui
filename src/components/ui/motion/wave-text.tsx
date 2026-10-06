import * as React from "react";
import { cn } from "@/lib/utils";

export interface WaveTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
  /** Stagger between characters of the entrance wave, in seconds. */
  delay?: number;
}

export function WaveText({ text, className, delay = 0.05, ...props }: WaveTextProps) {
  const letters = text.split("");

  return (
    <span data-slot="wave-text" className={cn("inline-flex select-none", className)} {...props}>
      {letters.map((char, i) => (
        // outer span owns the hover lift, inner span owns the staggered entrance,
        // so the entrance animation's fill does not freeze the hover transform.
        <span
          key={i}
          className="inline-block transition-transform duration-mid ease-kk-out hover:-translate-y-2 hover:text-primary"
        >
          <span
            className="kk-in kk-in-up inline-block"
            style={{ "--kk-delay": `${i * delay}s` } as React.CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}
