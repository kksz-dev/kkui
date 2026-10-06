import { useState, type ReactNode } from "react";
import { Code2, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock, CopyButton } from "./code-block";
import { ui, useLocale } from "@/i18n/locale";

export interface DemoBoxProps {
  title: string;
  description?: ReactNode;
  code: string;
  children: ReactNode;
  background?: string;
  previewClassName?: string;
  id?: string;
}

/** Demo card: preview on top, meta + toolbar, collapsible source. */
export function DemoBox({ title, description, code, children, background, previewClassName, id }: DemoBoxProps) {
  const [open, setOpen] = useState(false);
  const { l } = useLocale();
  const anchor = id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section
      id={anchor}
      className="scroll-mt-20 overflow-hidden rounded-lg border border-border-secondary bg-bg-container transition-[border-color,box-shadow] duration-mid ease-kk-in-out hover:border-border hover:shadow-kk-tertiary"
    >
      <div className={cn("kk-scrollbar relative max-w-full overflow-x-auto p-6", background, previewClassName)}>
        {children}
      </div>
      <div className="relative border-t border-dashed border-border-secondary px-6 py-3">
        <a
          href={`#${anchor}`}
          className="absolute -top-3 left-4 bg-bg-container px-1 text-sm font-medium text-text-heading hover:text-primary"
        >
          {title}
        </a>
        {description && (
          <div className="pt-1 text-sm text-text-secondary [&_code]:rounded-sm [&_code]:bg-fill-tertiary [&_code]:px-1 [&_code]:font-mono [&_code]:text-[.9em]">
            {description}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 border-t border-dashed border-border-secondary py-2">
        <CopyButton text={code} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="kk-press inline-flex size-7 items-center justify-center rounded-md text-text-tertiary transition-colors duration-mid hover:bg-fill-tertiary hover:text-text"
          aria-label={open ? l(ui.hideCode) : l(ui.showCode)}
          title={open ? l(ui.hideCode) : l(ui.showCode)}
        >
          {open ? (
            <ChevronUp className="size-4 transition-transform duration-mid" />
          ) : (
            <Code2 className="size-4 transition-transform duration-mid" />
          )}
        </button>
      </div>
      {open && (
        <div className="animate-in fade-in slide-in-from-top-1 border-t border-dashed border-border-secondary duration-200">
          <CodeBlock code={code} className="[&_pre]:rounded-none" />
        </div>
      )}
    </section>
  );
}
