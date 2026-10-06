import * as React from "react";
import { cn } from "@/lib/utils";
import { Affix } from "@/components/ui/affix";

/**
 * Anchor — KKUI hyperlinks to scroll on one page: a list of `#hash` links
 * whose active item follows the scroll position, with an animated ink bar.
 * Vertical (left ink) or horizontal (bottom ink), affixed by default.
 */

export type AnchorContainer = Window | HTMLElement | null;
export type AnchorDirection = "vertical" | "horizontal";

export interface AnchorLinkItem {
  key: React.Key;
  href: string;
  title: React.ReactNode;
  target?: string;
  replace?: boolean;
  /** Nested links (vertical direction only) */
  children?: AnchorLinkItem[];
  className?: string;
}

export interface AnchorLinkBaseProps {
  href: string;
  title: React.ReactNode;
  target?: string;
  replace?: boolean;
  className?: string;
}

export interface AnchorProps extends Omit<React.ComponentProps<"div">, "onClick" | "onChange"> {
  /** Link data */
  items?: AnchorLinkItem[];
  direction?: AnchorDirection;
  /** Fix the anchor while scrolling (uses Affix) */
  affix?: boolean;
  /** Pixels to offset from top when affixed */
  offsetTop?: number;
  /** Anchor scroll offset (defaults to offsetTop) */
  targetOffset?: number;
  /** Bounding distance of anchor area (px) */
  bounds?: number;
  /** Scrolling container */
  getContainer?: () => AnchorContainer;
  /** Customize the anchor highlight */
  getCurrentAnchor?: (activeLink: string) => string;
  /** Replace items in browser history instead of pushing */
  replace?: boolean;
  /** Keep the ink bar visible when `affix={false}` (it is hidden in that mode by default) */
  showInkInFixed?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, link: { title: React.ReactNode; href: string }) => void;
  onChange?: (currentActiveLink: string) => void;
}

/* -------------------------------- context -------------------------------- */

interface AnchorContextValue {
  activeLink: string;
  direction: AnchorDirection;
  registerLink: (href: string) => () => void;
  scrollTo: (href: string) => void;
  onClick?: AnchorProps["onClick"];
  replace: boolean;
}
const AnchorContext = React.createContext<AnchorContextValue | null>(null);

/* --------------------------------- utils --------------------------------- */

const getIdFromHref = (href: string) => {
  const i = href.indexOf("#");
  return i >= 0 ? decodeURIComponent(href.slice(i + 1)) : "";
};

const getContainerTop = (container: AnchorContainer): number => {
  if (container && container !== window) return (container as HTMLElement).getBoundingClientRect().top;
  return 0;
};

/* -------------------------------- Anchor --------------------------------- */

function Anchor({
  className,
  style,
  items,
  direction = "vertical",
  affix = true,
  offsetTop,
  targetOffset,
  bounds = 5,
  getContainer,
  getCurrentAnchor,
  replace = false,
  showInkInFixed = false,
  onClick,
  onChange,
  children,
  ...props
}: AnchorProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const linksRef = React.useRef<Set<string>>(new Set());
  const [activeLink, setActiveLink] = React.useState("");
  const [ink, setInk] = React.useState<React.CSSProperties | null>(null);
  const animatingRef = React.useRef<number | null>(null);
  const armRef = React.useRef<(() => void) | null>(null);
  const activeRef = React.useRef("");
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const getCurrentAnchorRef = React.useRef(getCurrentAnchor);
  getCurrentAnchorRef.current = getCurrentAnchor;

  const isHorizontal = direction === "horizontal";
  const scrollOffset = targetOffset ?? offsetTop ?? 0;
  // Static anchors drop the ink bar unless `showInkInFixed` asks to keep it.
  const showInk = affix || showInkInFixed;

  const setActive = React.useCallback((link: string) => {
    if (link === activeRef.current) return;
    activeRef.current = link;
    setActiveLink(link);
    onChangeRef.current?.(link);
  }, []);

  const getContainerRef = React.useRef(getContainer);
  getContainerRef.current = getContainer;
  const resolveContainer = React.useCallback((): AnchorContainer => (getContainerRef.current ? getContainerRef.current() : window), []);

  const updateActive = React.useCallback(() => {
    if (animatingRef.current != null) return;
    const container = resolveContainer();
    if (!container) return;
    const top = getContainerTop(container);
    let best: { href: string; top: number } | null = null;
    for (const href of linksRef.current) {
      const id = getIdFromHref(href);
      const el = id ? document.getElementById(id) : null;
      if (!el) continue;
      const t = el.getBoundingClientRect().top - top;
      if (t <= scrollOffset + bounds && (!best || t > best.top)) best = { href, top: t };
    }
    const found = best?.href ?? "";
    setActive(getCurrentAnchorRef.current ? getCurrentAnchorRef.current(found) : found);
  }, [resolveContainer, scrollOffset, bounds, setActive]);

  // subscribe to scrolling
  React.useEffect(() => {
    updateActive();
    const container = resolveContainer();
    window.addEventListener("scroll", updateActive, true);
    window.addEventListener("resize", updateActive);
    if (container && container !== window) (container as HTMLElement).addEventListener("scroll", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive, true);
      window.removeEventListener("resize", updateActive);
      if (container && container !== window) (container as HTMLElement).removeEventListener("scroll", updateActive);
    };
  }, [updateActive, resolveContainer]);

  // scroll to a link's target
  const scrollTo = React.useCallback(
    (href: string) => {
      const id = getIdFromHref(href);
      const el = id ? document.getElementById(id) : null;
      const container = resolveContainer();
      setActive(getCurrentAnchorRef.current ? getCurrentAnchorRef.current(href) : href);
      if (!el || !container) return;
      const delta = el.getBoundingClientRect().top - getContainerTop(container) - scrollOffset;
      // pause scroll-spy while the smooth scroll runs (until scroll events stop for 120ms)
      if (armRef.current) window.removeEventListener("scroll", armRef.current, true);
      const arm = () => {
        if (animatingRef.current != null) window.clearTimeout(animatingRef.current);
        animatingRef.current = window.setTimeout(() => {
          animatingRef.current = null;
          window.removeEventListener("scroll", arm, true);
          if (armRef.current === arm) armRef.current = null;
        }, 120);
      };
      armRef.current = arm;
      window.addEventListener("scroll", arm, true);
      arm();
      if (container === window) window.scrollTo({ top: window.scrollY + delta, behavior: "smooth" });
      else (container as HTMLElement).scrollTo({ top: (container as HTMLElement).scrollTop + delta, behavior: "smooth" });
    },
    [resolveContainer, scrollOffset, setActive],
  );

  // links (un)register from child effects; re-run the spy once the batch has settled
  const updateActiveRef = React.useRef(updateActive);
  updateActiveRef.current = updateActive;
  const registerLink = React.useCallback(
    (href: string) => {
      linksRef.current.add(href);
      queueMicrotask(() => updateActiveRef.current());
      return () => {
        linksRef.current.delete(href);
        queueMicrotask(() => updateActiveRef.current());
      };
    },
    [],
  );

  // ink bar follows the active link element
  React.useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const el = wrapper.querySelector<HTMLElement>('[data-slot="anchor-link-title"][data-active]');
    if (!el) {
      setInk(null);
      return;
    }
    const wRect = wrapper.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setInk(
      isHorizontal
        ? { left: rect.left - wRect.left + wrapper.scrollLeft, width: rect.width }
        : { top: rect.top - wRect.top, height: rect.height },
    );
  }, [activeLink, isHorizontal, items, children]);

  const ctx = React.useMemo<AnchorContextValue>(
    () => ({ activeLink, direction, registerLink, scrollTo, onClick, replace }),
    [activeLink, direction, registerLink, scrollTo, onClick, replace],
  );

  const renderItems = (list: AnchorLinkItem[]): React.ReactNode =>
    list.map(({ key, children: sub, ...rest }) => (
      <AnchorLink key={key} {...rest}>
        {sub && !isHorizontal ? renderItems(sub) : null}
      </AnchorLink>
    ));

  const content = (
    <AnchorContext.Provider value={ctx}>
      <div
        ref={wrapperRef}
        data-slot="anchor"
        data-direction={direction}
        data-fixed={!showInk ? "" : undefined}
        className={cn(
          "relative text-sm",
          isHorizontal ? "flex overflow-x-auto pb-px kk-scrollbar" : "pl-1",
          // track line
          isHorizontal
            ? "before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-split"
            : "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-split",
          className,
        )}
        style={style}
        {...props}
      >
        {/* ink */}
        {ink && showInk && (
          <span
            data-slot="anchor-ink"
            aria-hidden
            className={cn(
              "absolute rounded-full bg-primary transition-all duration-mid ease-kk-in-out",
              isHorizontal ? "bottom-0 h-0.5" : "left-0 w-0.5",
            )}
            style={ink}
          />
        )}
        <div className={cn(isHorizontal ? "flex" : "flex flex-col")}>{items ? renderItems(items) : children}</div>
      </div>
    </AnchorContext.Provider>
  );

  return affix ? (
    <Affix offsetTop={offsetTop} target={getContainer}>
      {content}
    </Affix>
  ) : (
    content
  );
}

/* ------------------------------- AnchorLink ------------------------------ */

export interface AnchorLinkProps extends AnchorLinkBaseProps {
  children?: React.ReactNode;
}

function AnchorLink({ href, title, target, replace: linkReplace, className, children }: AnchorLinkProps) {
  const ctx = React.useContext(AnchorContext);
  if (!ctx) throw new Error("AnchorLink must be used inside Anchor");
  const { activeLink, direction, registerLink, scrollTo, onClick, replace } = ctx;
  const active = activeLink === href;
  const isHorizontal = direction === "horizontal";

  React.useEffect(() => registerLink(href), [registerLink, href]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e, { title, href });
    if (e.defaultPrevented) return;
    // new-tab targets and modified clicks keep the native link behaviour
    if ((target && target !== "_self") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (linkReplace ?? replace) window.history.replaceState(null, "", href);
    else window.history.pushState(null, "", href);
    scrollTo(href);
  };

  return (
    <div data-slot="anchor-link" data-active={active || undefined} className={cn(isHorizontal && "shrink-0 pr-4 last:pr-0", className)}>
      <a
        data-slot="anchor-link-title"
        data-active={active || undefined}
        aria-current={active ? "location" : undefined}
        href={href}
        target={target}
        title={typeof title === "string" ? title : undefined}
        onClick={handleClick}
        className={cn(
          "relative block truncate transition-colors duration-mid ease-kk-in-out hover:text-primary-hover",
          isHorizontal ? "pb-2" : "py-1 pl-4",
          active ? "text-primary" : "text-text",
        )}
      >
        {title}
      </a>
      {children && !isHorizontal ? <div className="pl-4">{children}</div> : null}
    </div>
  );
}

/** Flat exports stay the primary API; the static mirrors `Anchor.Link`. */
const AnchorRoot = Object.assign(Anchor, { Link: AnchorLink });

export { AnchorRoot as Anchor, AnchorLink };
