import * as React from "react";
import { cn } from "@/lib/utils";

export interface RippleEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ripple colour — any CSS colour, token var by default. */
  color?: string;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

export function RippleEffect({
  color = "var(--kk-primary-bg-hover)",
  duration = 600,
  className,
  children,
  ...props
}: RippleEffectProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = { x, y, size, key: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, duration);
  };

  return (
    <div
      data-slot="ripple-effect"
      onClick={addRipple}
      className={cn("relative overflow-hidden cursor-pointer select-none", className)}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`,
          }}
          className="pointer-events-none absolute rounded-full animate-[ripple_0.6s_ease-out_forwards]"
        />
      ))}
    </div>
  );
}
