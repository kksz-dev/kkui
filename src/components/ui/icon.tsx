import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Two-tone palette                                                     */
/* ------------------------------------------------------------------ */

/** A single primary color, or an explicit `[primary, secondary]` pair. */
export type TwoToneColor = string | [string, string];

/** Built-in two-tone glyphs shipped with KKUI (no network needed). */
export type TwoToneIconName =
  | "check-circle"
  | "close-circle"
  | "info-circle"
  | "exclamation-circle"
  | "question-circle"
  | "clock-circle"
  | "smile"
  | "heart"
  | "star"
  | "lock"
  | "bell";

let twoToneColorStore: TwoToneColor = "var(--color-primary)";
const twoToneListeners = new Set<() => void>();

/** Set the two-tone color used by every `<Icon twoTone>` that has no local `twoToneColor`. */
export function setTwoToneColor(color: TwoToneColor): void {
  twoToneColorStore = color;
  twoToneListeners.forEach((listener) => listener());
}

/** Read the current global two-tone color. */
export function getTwoToneColor(): TwoToneColor {
  return twoToneColorStore;
}

function subscribeTwoToneColor(listener: () => void): () => void {
  twoToneListeners.add(listener);
  return () => {
    twoToneListeners.delete(listener);
  };
}

function useGlobalTwoToneColor(): TwoToneColor {
  return React.useSyncExternalStore(subscribeTwoToneColor, getTwoToneColor, getTwoToneColor);
}

interface TwoToneGlyph {
  /** Body shapes: filled with the secondary color and outlined with the primary color. */
  shapes: string[];
  /** Stroke-only details drawn in the primary color. */
  marks?: string[];
  /** Filled dots drawn in the primary color: `[cx, cy]`. */
  dots?: [number, number][];
}

const CIRCLE = "M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Z";

const TWO_TONE_GLYPHS: Record<TwoToneIconName, TwoToneGlyph> = {
  "check-circle": { shapes: [CIRCLE], marks: ["m8.2 12.4 2.6 2.6 5-5.4"] },
  "close-circle": { shapes: [CIRCLE], marks: ["m9.2 9.2 5.6 5.6", "m14.8 9.2-5.6 5.6"] },
  "info-circle": { shapes: [CIRCLE], marks: ["M12 11.4v4.8"], dots: [[12, 8]] },
  "exclamation-circle": { shapes: [CIRCLE], marks: ["M12 7.4v5.6"], dots: [[12, 16.2]] },
  "question-circle": {
    shapes: [CIRCLE],
    marks: ["M9.7 9.6a2.4 2.4 0 1 1 3.2 2.3c-.6.22-.9.75-.9 1.4v.4"],
    dots: [[12, 16.3]],
  },
  "clock-circle": { shapes: [CIRCLE], marks: ["M12 7.2V12l3.2 1.9"] },
  smile: { shapes: [CIRCLE], marks: ["M8.6 13.6a4 4 0 0 0 6.8 0"], dots: [[9.4, 9.8], [14.6, 9.8]] },
  heart: {
    shapes: ["M12 20.3S3.9 15.1 3.9 9.6a4.6 4.6 0 0 1 8.1-3 4.6 4.6 0 0 1 8.1 3c0 5.5-8.1 10.7-8.1 10.7Z"],
  },
  star: {
    shapes: ["M12 4 14.12 9.49 19.99 9.8 15.42 13.51 16.94 19.2 12 16 7.06 19.2 8.58 13.51 4.01 9.8 9.88 9.49Z"],
  },
  lock: {
    shapes: ["M6 10.6h12a1.4 1.4 0 0 1 1.4 1.4v7.2a1.4 1.4 0 0 1-1.4 1.4H6a1.4 1.4 0 0 1-1.4-1.4V12A1.4 1.4 0 0 1 6 10.6Z"],
    marks: ["M8.2 10.6V7.8a3.8 3.8 0 0 1 7.6 0v2.8"],
  },
  bell: {
    shapes: ["M12 3.4a6 6 0 0 1 6 6v4.7l1.6 2.4H4.4L6 14.1V9.4a6 6 0 0 1 6-6Z"],
    marks: ["M9.9 19.4a2.2 2.2 0 0 0 4.2 0"],
  },
};

/** Names of every built-in two-tone glyph, handy for pickers and docs. */
export const twoToneIconNames = Object.keys(TWO_TONE_GLYPHS) as TwoToneIconName[];

function TwoToneGlyphSvg({
  glyph,
  primary,
  secondary,
}: {
  glyph: TwoToneGlyph;
  primary: string;
  secondary?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className="size-full" xmlns="http://www.w3.org/2000/svg">
      {glyph.shapes.map((d, i) => (
        <path key={`fill-${i}`} d={d} fill={secondary ?? primary} fillOpacity={secondary ? 1 : 0.22} />
      ))}
      {glyph.shapes.map((d, i) => (
        <path key={`line-${i}`} d={d} fill="none" stroke={primary} strokeWidth={1.7} strokeLinejoin="round" />
      ))}
      {glyph.marks?.map((d, i) => (
        <path
          key={`mark-${i}`}
          d={d}
          fill="none"
          stroke={primary}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {glyph.dots?.map(([cx, cy], i) => (
        <circle key={`dot-${i}`} cx={cx} cy={cy} r={1.05} fill={primary} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* On-demand Iconify lookup                                             */
/* ------------------------------------------------------------------ */

const ICON_STORAGE_PREFIX = "kkui-icon:";
const iconSvgCache = new Map<string, string>();

function readStoredIcon(iconName: string): string | null {
  try {
    return window.localStorage.getItem(ICON_STORAGE_PREFIX + iconName);
  } catch {
    return null;
  }
}

function writeStoredIcon(iconName: string, svg: string): void {
  try {
    window.localStorage.setItem(ICON_STORAGE_PREFIX + iconName, svg);
  } catch {
    /* private mode or quota exceeded — the in-memory cache still applies */
  }
}

/** Synchronously read an already-cached icon (memory first, then localStorage). */
export function getCachedIconSvg(iconName: string): string | null {
  const memo = iconSvgCache.get(iconName);
  if (memo) return memo;
  const stored = readStoredIcon(iconName);
  if (stored) {
    iconSvgCache.set(iconName, stored);
    return stored;
  }
  return null;
}

/**
 * Fetch one icon from the Iconify API, on demand, so no icon set is bundled.
 * Results are cached in memory and in localStorage, and the request can be aborted.
 */
export async function fetchIconSvg(iconName: string, signal?: AbortSignal): Promise<string> {
  const cached = getCachedIconSvg(iconName);
  if (cached) return cached;

  const [prefix, name] = iconName.includes(":") ? iconName.split(":") : ["lucide", iconName];
  const res = await fetch(`https://api.iconify.design/${prefix}/${name}.svg`, { signal });
  if (!res.ok) throw new Error(`Icon not found: ${iconName}`);

  const svg = await res.text();
  if (!svg.trimStart().startsWith("<svg")) throw new Error(`Icon not found: ${iconName}`);

  iconSvgCache.set(iconName, svg);
  writeStoredIcon(iconName, svg);
  return svg;
}

/* ------------------------------------------------------------------ */
/* Icon                                                                 */
/* ------------------------------------------------------------------ */

export interface IconProps extends Omit<React.ComponentProps<"span">, "color"> {
  /** Iconify identifier fetched on demand, e.g. "solar:shield-check-bold", "lucide:bell" */
  name?: string;
  /** Built-in two-tone glyph, rendered offline */
  twoTone?: TwoToneIconName;
  /** React element icon (e.g. `<User />`); also the offline fallback for `name` */
  icon?: React.ReactNode;
  /** Raw SVG path `d` string */
  path?: string;
  /** Custom SVG component to render */
  component?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** SVG viewBox when using `path` */
  viewBox?: string;
  /** Rotate icon continuously */
  spin?: boolean;
  /** Rotate degrees */
  rotate?: number;
  /** Flip horizontal or vertical */
  flip?: "horizontal" | "vertical" | "both";
  /** Font size / dimensions */
  size?: number | string;
  /** Icon color (sets `currentColor` for the glyph) */
  color?: string;
  /** Colors of a `twoTone` glyph: `primary` or `[primary, secondary]` */
  twoToneColor?: TwoToneColor;
  /** Custom children (Lucide element or raw SVG); also the offline fallback for `name` */
  children?: React.ReactNode;
}

export function Icon({
  name,
  twoTone,
  icon,
  path,
  component: Component,
  viewBox = "0 0 24 24",
  spin = false,
  rotate,
  flip,
  size = "1em",
  color,
  twoToneColor,
  className,
  style,
  children,
  ...props
}: IconProps) {
  const [svgContent, setSvgContent] = React.useState<string | null>(() =>
    name ? getCachedIconSvg(name) : null,
  );
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!name) {
      setSvgContent(null);
      setFailed(false);
      return;
    }

    const cached = getCachedIconSvg(name);
    if (cached) {
      setSvgContent(cached);
      setFailed(false);
      return;
    }

    setSvgContent(null);
    setFailed(false);

    const controller = new AbortController();
    fetchIconSvg(name, controller.signal)
      .then((svg) => setSvgContent(svg))
      .catch(() => {
        // Offline, blocked, or unknown icon — fall back instead of throwing.
        if (!controller.signal.aborted) setFailed(true);
      });

    return () => controller.abort();
  }, [name]);

  const globalTwoToneColor = useGlobalTwoToneColor();
  const effectiveTwoTone = twoToneColor ?? globalTwoToneColor;
  const twoTonePrimary = Array.isArray(effectiveTwoTone) ? effectiveTwoTone[0] : effectiveTwoTone;
  const twoToneSecondary = Array.isArray(effectiveTwoTone) ? effectiveTwoTone[1] : undefined;

  const scaleX = flip === "horizontal" || flip === "both" ? -1 : 1;
  const scaleY = flip === "vertical" || flip === "both" ? -1 : 1;

  const mergedStyle: React.CSSProperties = {
    fontSize: typeof size === "number" ? `${size}px` : size,
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    color,
    // Individual transform properties: `spin` animates `transform`, so it can never override them.
    rotate: rotate ? `${rotate}deg` : undefined,
    scale: flip ? `${scaleX} ${scaleY}` : undefined,
    ...style,
  };

  // Anything the caller supplied inline works offline and doubles as the `name` fallback.
  const offlineContent: React.ReactNode =
    children ??
    icon ??
    (Component ? (
      <Component className="size-full" />
    ) : path ? (
      <svg viewBox={viewBox} className="size-full fill-current stroke-none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    ) : null);

  let renderedContent: React.ReactNode = offlineContent;

  if (twoTone) {
    renderedContent = (
      <TwoToneGlyphSvg glyph={TWO_TONE_GLYPHS[twoTone]} primary={twoTonePrimary} secondary={twoToneSecondary} />
    );
  } else if (name) {
    if (svgContent) {
      renderedContent = (
        <span
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="inline-flex size-full items-center justify-center [&_svg]:size-full"
        />
      );
    } else if (offlineContent) {
      renderedContent = offlineContent;
    } else {
      // Reserve the final size so the layout never jumps when the icon arrives.
      renderedContent = (
        <span
          className={cn(
            "inline-block size-full rounded-sm",
            failed ? "border border-dashed border-border" : "kk-shimmer",
          )}
        />
      );
    }
  }

  const ariaLabel = props["aria-label"] ?? name ?? twoTone;
  const decorative = !ariaLabel && !props["aria-labelledby"];

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      aria-hidden={decorative ? true : undefined}
      data-slot="icon"
      className={cn(
        "inline-flex shrink-0 items-center justify-center align-middle leading-none",
        spin && "animate-spin",
        "[&_svg]:size-full [&_svg]:inline-block",
        className,
      )}
      style={mergedStyle}
      {...props}
    >
      {renderedContent}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Iconfont sprite                                                      */
/* ------------------------------------------------------------------ */

export interface CustomIconOptions {
  /** URL(s) of the symbol sprite script generated on iconfont.cn */
  scriptUrl: string | string[];
  /** Props applied to every icon produced by the returned component */
  extraCommonProps?: Partial<IconProps>;
}

export interface IconFontProps extends IconProps {
  /** Symbol id inside the sprite, without the leading `#` */
  type: string;
}

/**
 * Load an iconfont.cn symbol sprite and return an `<Icon>` bound to it.
 * The returned component renders `<svg><use xlinkHref="#type" /></svg>`,
 * which is how the injected sprite is meant to be referenced.
 */
export function createFromIconfontCN(options: CustomIconOptions) {
  const { scriptUrl, extraCommonProps } = options;

  if (typeof document !== "undefined" && scriptUrl) {
    const urls = Array.isArray(scriptUrl) ? scriptUrl : [scriptUrl];
    urls.forEach((url) => {
      if (!document.querySelector(`script[data-namespace="${url}"]`)) {
        const script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("data-namespace", url);
        document.body.appendChild(script);
      }
    });
  }

  return function IconFont({ type, ...rest }: IconFontProps) {
    return (
      <Icon aria-label={type} {...extraCommonProps} {...rest}>
        <svg className="size-full" fill="currentColor" aria-hidden="true">
          <use xlinkHref={`#${type}`} />
        </svg>
      </Icon>
    );
  };
}
