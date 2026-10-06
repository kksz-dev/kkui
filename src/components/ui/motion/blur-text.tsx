import * as React from "react";
import { cn } from "@/lib/utils";

export interface BlurTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  onAnimationComplete?: () => void;
}

export function BlurText({
  text,
  delay = 50,
  className,
  animateBy = "words",
  direction = "top",
  onAnimationComplete,
  ...props
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLHeadingElement>(null);

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
    <h2
      ref={ref}
      data-slot="blur-text"
      className={cn("inline-flex flex-wrap gap-x-1.5", className)}
      {...props}
    >
      {elements.map((el, i) => (
        <span
          key={i}
          style={{
            transitionDuration: "600ms",
            transitionDelay: `${i * delay}ms`,
            transform: inView
              ? "translateY(0)"
              : direction === "top"
                ? "translateY(-18px)"
                : "translateY(18px)",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
          }}
          className="inline-block transition-all ease-kk-out"
          onTransitionEnd={i === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {el === " " ? "\u00A0" : el}
        </span>
      ))}
    </h2>
  );
}
