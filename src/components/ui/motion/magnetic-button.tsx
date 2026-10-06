import * as React from "react";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  className?: string;
  children: React.ReactNode;
}

export function MagneticButton({
  strength = 0.35,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      data-slot="magnetic-button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
      }}
      className={cn("inline-flex items-center justify-center rounded-lg border border-border bg-bg-container px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary", className)}
      {...props}
    >
      {children}
    </button>
  );
}
