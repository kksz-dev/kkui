import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Colour of the cursor spotlight — any CSS colour, token var by default. */
  spotlightColor?: string;
  className?: string;
  children: React.ReactNode;
}

export function SpotlightCard({
  spotlightColor = "var(--kk-primary-bg)",
  className,
  children,
  ...props
}: SpotlightCardProps) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      data-slot="spotlight-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-bg-container p-6 transition-all duration-mid",
        className,
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
