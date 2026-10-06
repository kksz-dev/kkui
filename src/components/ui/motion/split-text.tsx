import * as React from "react";
import { cn } from "@/lib/utils";

export interface SplitTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: string;
}

export function SplitText({
  text,
  className,
  delay = 40,
  animationFrom = { opacity: 0, transform: "translateY(30px)" },
  animationTo = { opacity: 1, transform: "translateY(0)" },
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  ...props
}: SplitTextProps) {
  const letters = text.split("");
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      data-slot="split-text"
      className={cn("inline-block overflow-hidden", className)}
      {...props}
    >
      {letters.map((char, i) => (
        <span
          key={i}
          style={{
            transitionDuration: "500ms",
            transitionTimingFunction: easing,
            transitionDelay: `${i * delay}ms`,
            opacity: inView ? animationTo.opacity : animationFrom.opacity,
            transform: inView ? animationTo.transform : animationFrom.transform,
          }}
          className="inline-block transition-all"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
