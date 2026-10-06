import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { orderedComponents } from "@/routes/autoRoutes";
import { tr, useLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

const text = {
  previous: tr("ก่อนหน้า", "Previous"),
  next: tr("ถัดไป", "Next"),
  keepScrolling: tr("เลื่อนต่อเพื่อไป", "Keep scrolling for"),
  release: tr("ปล่อยเพื่อไปต่อ", "Release to continue"),
};

/** How much overscroll past the bottom moves on to the next page. */
const THRESHOLD = 220;

/**
 * Continue-scrolling navigation: once the page bottom is reached, further wheel
 * or touch movement fills a small indicator and then follows the next link.
 */
function useOverscrollNext(nextPath?: string) {
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);
  const travelled = React.useRef(0);
  const armed = React.useRef(false);

  React.useEffect(() => {
    if (!nextPath) return;

    const atBottom = () => window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

    const reset = () => {
      travelled.current = 0;
      armed.current = false;
      setProgress(0);
    };

    const advance = (delta: number) => {
      if (delta <= 0 || !atBottom()) {
        if (!atBottom() && travelled.current) reset();
        return;
      }
      travelled.current += delta;
      const next = Math.min(1, travelled.current / THRESHOLD);
      setProgress(next);
      if (next >= 1 && !armed.current) {
        armed.current = true;
        window.scrollTo({ top: 0 });
        navigate(nextPath);
        reset();
      }
    };

    const onWheel = (e: WheelEvent) => advance(e.deltaY);

    let lastTouch = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouch = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      advance(lastTouch - y);
      lastTouch = y;
    };

    const onScroll = () => {
      if (!atBottom()) reset();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [nextPath, navigate]);

  return progress;
}

export function DocPager({ slug }: { slug: string }) {
  const { l } = useLocale();
  const index = orderedComponents.findIndex((c) => c.slug === slug);
  const previous = index > 0 ? orderedComponents[index - 1] : undefined;
  const next = index >= 0 ? orderedComponents[index + 1] : undefined;
  const progress = useOverscrollNext(next?.path);

  if (!previous && !next) return null;

  return (
    <>
      <nav aria-label="Component pagination" className="mt-14 grid gap-3 border-t border-border-secondary pt-6 sm:grid-cols-2">
        {previous ? (
          <Link
            to={previous.path}
            className="kk-press group flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors duration-mid hover:border-primary hover:bg-primary-bg/40"
          >
            <ArrowLeft className="size-4 shrink-0 text-text-tertiary transition-transform duration-mid group-hover:-translate-x-0.5 group-hover:text-primary" />
            <span className="min-w-0">
              <span className="block text-xs text-text-tertiary">{l(text.previous)}</span>
              <span className="block truncate font-medium text-text-heading group-hover:text-primary">{previous.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            to={next.path}
            className="kk-press group flex items-center justify-end gap-3 rounded-lg border border-border px-4 py-3 text-right transition-colors duration-mid hover:border-primary hover:bg-primary-bg/40"
          >
            <span className="min-w-0">
              <span className="block text-xs text-text-tertiary">{l(text.next)}</span>
              <span className="block truncate font-medium text-text-heading group-hover:text-primary">{next.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-text-tertiary transition-transform duration-mid group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        )}
      </nav>

      {/* keep-scrolling indicator, only while the reader is pushing past the end */}
      {next && progress > 0.02 && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-6"
        >
          <div className="flex items-center gap-3 rounded-full border border-border bg-bg-elevated/95 px-4 py-2 shadow-kk backdrop-blur">
            <ChevronDown className={cn("size-4 text-primary transition-transform", progress >= 1 && "rotate-180")} />
            <span className="text-xs text-text-secondary">
              {l(progress >= 1 ? text.release : text.keepScrolling)}{" "}
              <span className="font-medium text-text-heading">{next.title}</span>
            </span>
            <span className="h-1 w-16 overflow-hidden rounded-full bg-fill-secondary">
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-75"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
          </div>
        </div>
      )}
    </>
  );
}
