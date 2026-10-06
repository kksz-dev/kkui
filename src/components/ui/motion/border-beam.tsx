import * as React from "react";
import { cn } from "@/lib/utils";

export interface BorderBeamProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  /** Head colour of the beam — any CSS colour, token var by default. */
  colorFrom?: string;
  /** Tail colour of the beam — any CSS colour, token var by default. */
  colorTo?: string;
  className?: string;
}

export function BorderBeam({
  size = 200,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = "var(--kk-primary)",
  colorTo = "var(--kk-success)",
  className,
}: BorderBeamProps) {
  return (
    <div
      data-slot="border-beam"
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:var(--border-width)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[var(--size)] after:animate-[border-beam_var(--duration)_infinite_linear] after:[animation-play-state:running]",
        "after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--size)/2)_calc(var(--size)/2)] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)))]",
        className,
      )}
    />
  );
}
