import * as React from "react";
import { cn } from "@/lib/utils";

export interface TiltedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxAngle?: number;
  scale?: number;
  perspective?: number;
  className?: string;
  children: React.ReactNode;
}

export function TiltedCard({
  maxAngle = 12,
  scale = 1.02,
  perspective = 1000,
  className,
  children,
  ...props
}: TiltedCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [transform, setTransform] = React.useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxAngle;
    const rotateY = ((x - centerX) / centerX) * maxAngle;

    setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  };

  return (
    <div
      ref={cardRef}
      data-slot="tilted-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={cn("rounded-xl border border-border bg-bg-container p-6 shadow-kk", className)}
      {...props}
    >
      {children}
    </div>
  );
}
