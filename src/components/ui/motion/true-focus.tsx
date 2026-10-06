import * as React from "react";
import { cn } from "@/lib/utils";

export interface TrueFocusProps extends React.HTMLAttributes<HTMLDivElement> {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  /** Frame colour — any CSS colour, token var by default. */
  borderColor?: string;
  /** Glow colour around the frame — any CSS colour, token var by default. */
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

export function TrueFocus({
  sentence = "True Focus Motion System",
  manualMode = false,
  blurAmount = 4,
  borderColor = "var(--kk-primary)",
  glowColor = "var(--kk-primary-border-hover)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className,
  ...props
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [focusRect, setFocusRect] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wordRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  React.useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, words.length, animationDuration, pauseBetweenAnimations]);

  React.useEffect(() => {
    const el = wordRefs.current[currentIndex];
    const container = containerRef.current;
    if (el && container) {
      const cRect = container.getBoundingClientRect();
      const wRect = el.getBoundingClientRect();
      setFocusRect({
        x: wRect.left - cRect.left,
        y: wRect.top - cRect.top,
        width: wRect.width,
        height: wRect.height,
      });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      data-slot="true-focus"
      className={cn("relative inline-flex flex-wrap items-center gap-2 p-2", className)}
      {...props}
    >
      {words.map((word, i) => {
        const isFocused = i === currentIndex;
        return (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            onMouseEnter={manualMode ? () => setCurrentIndex(i) : undefined}
            style={{
              filter: isFocused ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: isFocused ? 1 : 0.4,
              transition: `all ${animationDuration}s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
            className="cursor-pointer text-lg font-semibold text-text select-none"
          >
            {word}
          </span>
        );
      })}

      {focusRect && (
        <span
          style={{
            transform: `translate(${focusRect.x}px, ${focusRect.y}px)`,
            width: focusRect.width,
            height: focusRect.height,
            borderColor,
            boxShadow: `0 0 16px ${glowColor}`,
            transition: `all ${animationDuration}s cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
          className="pointer-events-none absolute left-0 top-0 rounded-md border-2"
        />
      )}
    </div>
  );
}
