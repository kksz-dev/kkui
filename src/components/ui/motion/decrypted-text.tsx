import * as React from "react";
import { cn } from "@/lib/utils";

export interface DecryptedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover";
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-=";

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className,
  encryptedClassName,
  animateOn = "hover",
  ...props
}: DecryptedTextProps) {
  const [chars, setChars] = React.useState<string[]>(() => text.split(""));
  const [revealed, setRevealed] = React.useState<boolean[]>(() => text.split("").map(() => true));
  const ref = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  /** Pool the scrambler draws from: the full character set, or only what `text` already contains. */
  const pool = React.useMemo(() => {
    if (!useOriginalCharsOnly) return characters;
    const unique = [...new Set(text.split("").filter((c) => c.trim() !== ""))];
    return unique.length > 0 ? unique.join("") : characters;
  }, [useOriginalCharsOnly, characters, text]);

  /** 0 = revealed first, 1 = revealed last. */
  const revealOrder = React.useCallback(
    (i: number, len: number) => {
      if (revealDirection === "end") return (len - 1 - i) / len;
      if (revealDirection === "center") {
        const mid = (len - 1) / 2;
        return mid === 0 ? 0 : Math.abs(i - mid) / mid;
      }
      return i / len;
    },
    [revealDirection],
  );

  const startScramble = React.useCallback(() => {
    if (timer.current) return;
    const source = text.split("");
    let iteration = 0;

    timer.current = setInterval(() => {
      iteration += 1;

      if (iteration > maxIterations) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setChars(source);
        setRevealed(source.map(() => true));
        return;
      }

      const progress = iteration / maxIterations;
      const flags = source.map(
        (char, i) =>
          char === " " ||
          (sequential ? revealOrder(i, source.length) <= progress : iteration >= maxIterations),
      );
      setRevealed(flags);
      setChars(
        source.map((char, i) =>
          flags[i] ? char : pool[Math.floor(Math.random() * pool.length)]!,
        ),
      );
    }, speed);
  }, [text, speed, maxIterations, sequential, revealOrder, pool]);

  React.useEffect(() => {
    // a new `text` cancels whatever is running and shows the new string as-is
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setChars(text.split(""));
    setRevealed(text.split("").map(() => true));
  }, [text]);

  React.useEffect(() => {
    if (animateOn !== "view") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startScramble();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animateOn, startScramble]);

  React.useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  return (
    <span
      ref={ref}
      data-slot="decrypted-text"
      onMouseEnter={animateOn === "hover" ? startScramble : undefined}
      className={cn("inline-block font-mono select-none cursor-default", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <span key={i} className={revealed[i] ? undefined : encryptedClassName}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}
