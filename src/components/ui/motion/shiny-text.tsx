import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  disabled?: boolean;
  speed?: number;
  /** Resting colour of the text — any CSS colour, token var by default. */
  baseColor?: string;
  /** Colour of the sweeping highlight — any CSS colour, token var by default. */
  shineColor?: string;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  baseColor = "var(--kk-text-tertiary)",
  shineColor = "var(--kk-text)",
  className,
  ...props
}: ShinyTextProps) {
  return (
    <span
      data-slot="shiny-text"
      className={cn(
        "inline-block bg-[length:200%_100%] bg-clip-text text-transparent",
        !disabled && "animate-[shiny_4s_infinite_linear]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(110deg, ${baseColor}, 45%, ${shineColor}, 55%, ${baseColor})`,
        animationDuration: `${speed}s`,
      }}
      {...props}
    >
      {text}
    </span>
  );
}
