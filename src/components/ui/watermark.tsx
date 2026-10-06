import * as React from "react";
import { cn } from "@/lib/utils";

export interface WatermarkFont {
  color?: string;
  fontSize?: number | string;
  fontWeight?: "normal" | "light" | "weight" | number | string;
  fontFamily?: string;
  fontStyle?: "none" | "normal" | "italic" | "oblique";
  textAlign?: "start" | "end" | "left" | "right" | "center";
}

export interface WatermarkProps extends Omit<React.ComponentProps<"div">, "content"> {
  /** The content of the watermark (single or multi-line) */
  content?: string | string[];
  /** Image URL for watermark graphic */
  image?: string;
  /** Width of watermark element in px */
  width?: number;
  /** Height of watermark element in px */
  height?: number;
  /** Rotate angle in degrees (default -22) */
  rotate?: number;
  /** Z-index of watermark layer (default 9) */
  zIndex?: number;
  /** Gap between watermark marks [x, y] (default [100, 100]) */
  gap?: [number, number];
  /** Offset of watermark mark from top-left [x, y] */
  offset?: [number, number];
  /** Font settings */
  font?: WatermarkFont;
  /**
   * Whether popup surfaces rendered inside this subtree (Modal, Drawer, Popover…)
   * repaint the same watermark on their own panel. Set `false` to keep the
   * watermark on the page only.
   */
  inherit?: boolean;
  /** Extra class name on the root element, applied together with `className` */
  rootClassName?: string;
}

/** The painted watermark handed down to portalled surfaces. */
export interface WatermarkLayer {
  /** Generated tile as a data URL */
  url: string;
  zIndex: number;
  offsetX: number;
  offsetY: number;
}

const WatermarkContext = React.createContext<WatermarkLayer | null>(null);

/**
 * The watermark surrounding this subtree, or `null` when there is none.
 * React context crosses portals, so this also works inside Modal/Drawer/Popover.
 */
export function useWatermark(): WatermarkLayer | null {
  return React.useContext(WatermarkContext);
}

/**
 * Ref callback for a portalled panel (Modal / Drawer / Popover content) so it
 * repaints the watermark of the `<Watermark inherit>` that wraps it.
 * Pass the panel's own ref to keep it working.
 */
export function useWatermarkPanelRef<T extends HTMLElement>(
  forwardTo?: React.RefObject<T | null>,
): React.RefCallback<T> {
  const layer = useWatermark();
  const [node, setNode] = React.useState<T | null>(null);
  const url = layer?.url ?? "";
  const zIndex = layer?.zIndex ?? 9;
  const offsetX = layer?.offsetX ?? 0;
  const offsetY = layer?.offsetY ?? 0;

  React.useEffect(() => {
    if (!node || !url) return;

    const overlay = document.createElement("div");
    overlay.setAttribute("data-slot", "watermark-overlay");
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      zIndex: String(zIndex),
      pointerEvents: "none",
      backgroundRepeat: "repeat",
      backgroundImage: `url(${url})`,
      backgroundPosition: `${offsetX}px ${offsetY}px`,
    });

    const previousPosition = node.style.position;
    if (getComputedStyle(node).position === "static") node.style.position = "relative";
    node.appendChild(overlay);

    return () => {
      overlay.remove();
      node.style.position = previousPosition;
    };
  }, [node, url, zIndex, offsetX, offsetY]);

  return React.useCallback(
    (element: T | null) => {
      if (forwardTo) forwardTo.current = element;
      setNode(element);
    },
    [forwardTo],
  );
}

function Watermark({
  children,
  className,
  content,
  image,
  width,
  height,
  rotate = -22,
  zIndex = 9,
  gap = [100, 100],
  offset,
  font,
  inherit = true,
  rootClassName,
  style,
  ...props
}: WatermarkProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const watermarkRef = React.useRef<HTMLDivElement>(null);
  const [watermarkUrl, setWatermarkUrl] = React.useState<string>("");
  const [renderKey, setRenderKey] = React.useState(0);
  const [isDark, setIsDark] = React.useState(false);

  // Monitor theme changes
  React.useEffect(() => {
    const updateDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    updateDark();
    const observer = new MutationObserver(updateDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const [gapX, gapY] = gap;
  const [offsetX, offsetY] = offset ?? [gapX / 2, gapY / 2];

  const mergedFont = React.useMemo(() => {
    const defaultColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)";
    const fs: number =
      font?.fontSize !== undefined
        ? typeof font.fontSize === "number"
          ? font.fontSize
          : parseFloat(String(font.fontSize)) || 16
        : 16;
    return {
      color: font?.color ?? defaultColor,
      fontSize: fs,
      fontWeight: font?.fontWeight ?? "normal",
      fontFamily: font?.fontFamily ?? "sans-serif",
      fontStyle: font?.fontStyle ?? "normal",
      textAlign: (font?.textAlign as CanvasTextAlign) ?? ("center" as CanvasTextAlign),
    };
  }, [font, isDark]);

  // Generate watermark data URL
  React.useEffect(() => {
    if (!content && !image) {
      setWatermarkUrl("");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const contents = Array.isArray(content) ? content : content ? [content] : [];

    const draw = (imgEl?: HTMLImageElement) => {
      const fontSize = mergedFont.fontSize;
      ctx.font = `${mergedFont.fontStyle} ${mergedFont.fontWeight} ${fontSize}px ${mergedFont.fontFamily}`;

      let markWidth = width;
      let markHeight = height;

      if (!markWidth) {
        if (imgEl) {
          markWidth = imgEl.width || 120;
        } else {
          let maxTextWidth = 0;
          for (const line of contents) {
            const m = ctx.measureText(line);
            if (m.width > maxTextWidth) maxTextWidth = m.width;
          }
          markWidth = maxTextWidth || 120;
        }
      }

      if (!markHeight) {
        if (imgEl) {
          markHeight = imgEl.height || 64;
        } else {
          const lineHeight = fontSize * 1.5;
          markHeight = Math.max(contents.length * lineHeight, 32);
        }
      }

      const canvasWidth = gapX + markWidth;
      const canvasHeight = gapY + markHeight;

      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.scale(dpr, dpr);

      // Re-apply font after resize
      ctx.font = `${mergedFont.fontStyle} ${mergedFont.fontWeight} ${fontSize}px ${mergedFont.fontFamily}`;
      ctx.fillStyle = mergedFont.color;
      ctx.textAlign = mergedFont.textAlign;
      ctx.textBaseline = "middle";

      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((rotate * Math.PI) / 180);

      if (imgEl) {
        ctx.drawImage(imgEl, -markWidth / 2, -markHeight / 2, markWidth, markHeight);
      } else {
        const lineHeight = fontSize * 1.4;
        const totalHeight = contents.length * lineHeight;
        const startY = -totalHeight / 2 + lineHeight / 2;

        contents.forEach((line, index) => {
          ctx.fillText(line, 0, startY + index * lineHeight);
        });
      }

      ctx.restore();
      setWatermarkUrl(canvas.toDataURL("image/png"));
    };

    if (image) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.onload = () => draw(img);
      img.src = image;
    } else {
      draw();
    }
  }, [content, image, width, height, rotate, gapX, gapY, mergedFont]);

  // Anti-tamper MutationObserver
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const removed = Array.from(mutation.removedNodes);
          if (removed.includes(watermarkRef.current!)) {
            setRenderKey((k) => k + 1);
          }
        } else if (mutation.target === watermarkRef.current) {
          setRenderKey((k) => k + 1);
        }
      }
    });

    observer.observe(container, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, []);

  // Handed to portalled surfaces (Modal / Drawer / Popover) when `inherit` is on.
  const layer = React.useMemo<WatermarkLayer | null>(
    () => (inherit && watermarkUrl ? { url: watermarkUrl, zIndex, offsetX, offsetY } : null),
    [inherit, watermarkUrl, zIndex, offsetX, offsetY],
  );

  return (
    <WatermarkContext.Provider value={layer}>
      <div
        ref={containerRef}
        data-slot="watermark"
        className={cn("relative overflow-hidden", className, rootClassName)}
        style={{ position: "relative", ...style }}
        {...props}
      >
        {children}
        {watermarkUrl && (
          <div
            key={renderKey}
            ref={watermarkRef}
            data-slot="watermark-overlay"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex,
              pointerEvents: "none",
              backgroundRepeat: "repeat",
              backgroundImage: `url(${watermarkUrl})`,
              backgroundPosition: `${offsetX}px ${offsetY}px`,
            }}
          />
        )}
      </div>
    </WatermarkContext.Provider>
  );
}

export { Watermark };
