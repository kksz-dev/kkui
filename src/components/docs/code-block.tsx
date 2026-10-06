import { Highlight, themes, type Language } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), timeout);
    } catch {
      /* clipboard unavailable */
    }
  };
  return { copied, copy };
}

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={() => void copy(text)}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-fill-tertiary hover:text-text",
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function CodeBlock({
  code,
  language = "tsx",
  className,
  showCopy = true,
}: {
  code: string;
  language?: Language;
  className?: string;
  showCopy?: boolean;
}) {
  const { theme } = useTheme();
  const trimmed = code.replace(/\n+$/, "");
  return (
    <div className={cn("group/code relative", className)}>
      {showCopy && <CopyButton text={trimmed} className="absolute top-2 right-2 z-10 bg-bg-container/80" />}
      <Highlight code={trimmed} language={language} theme={theme === "dark" ? themes.vsDark : themes.github}>
        {({ className: c, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              c,
              "kk-scrollbar overflow-x-auto rounded-md bg-bg-layout p-4 pr-12 font-mono text-[13px] leading-6 dark:bg-[#0d0d0d]",
            )}
            style={{ backgroundColor: undefined }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
