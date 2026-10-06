import * as React from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Loader2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type QRCodeStatus = "active" | "expired" | "loading" | "scanned";
export type QRCodeErrorLevel = "L" | "M" | "Q" | "H";
export type QRCodeType = "canvas" | "svg";

export interface QRCodeProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** The value to encode in the QR code */
  value: string;
  /** Render mode: canvas or svg */
  type?: QRCodeType;
  /** Size in pixels (default 160) */
  size?: number;
  /** Icon image URL placed at the center of the QR code */
  icon?: string;
  /** Icon size in pixels or { width, height } */
  iconSize?: number | { width: number; height: number };
  /** QR code foreground color */
  color?: string;
  /** QR code background color */
  bgColor?: string;
  /** Whether to show card border and padding */
  bordered?: boolean;
  /** Error correction level: L (7%), M (15%), Q (25%), H (30%) */
  errorLevel?: QRCodeErrorLevel;
  /** Status of QR code: active, expired, loading, scanned */
  status?: QRCodeStatus;
  /** Callback triggered when clicking the refresh button on expired status */
  onRefresh?: () => void;
  /** Custom status overlay renderer */
  statusRender?: (info: { status: QRCodeStatus; onRefresh?: () => void }) => React.ReactNode;
}

const QRCode = React.forwardRef<HTMLDivElement, QRCodeProps>(function QRCode(
  {
    className,
    value,
    type = "canvas",
    size = 160,
    icon,
    iconSize,
    color,
    bgColor,
    bordered = true,
    errorLevel = "M",
    status = "active",
    onRefresh,
    statusRender,
    style,
    ...props
  },
  ref,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [resolvedFg, setResolvedFg] = React.useState("#000000");

  React.useImperativeHandle(ref, () => containerRef.current!);

  React.useEffect(() => {
    if (color) {
      setResolvedFg(color);
      return;
    }
    const updateFg = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setResolvedFg(isDark ? "#ffffff" : "#000000");
    };
    updateFg();
    const observer = new MutationObserver(updateFg);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [color]);

  const imageSettings = React.useMemo(() => {
    if (!icon) return undefined;
    const defaultIconSize = Math.floor(size * 0.25);
    const w = typeof iconSize === "object" ? iconSize.width : (iconSize ?? defaultIconSize);
    const h = typeof iconSize === "object" ? iconSize.height : (iconSize ?? defaultIconSize);
    return {
      src: icon,
      width: w,
      height: h,
      excavate: true,
    };
  }, [icon, iconSize, size]);

  const fg = color ?? resolvedFg;
  const bg = bgColor ?? "transparent";

  const qrProps = {
    value: value || " ",
    size,
    fgColor: fg,
    bgColor: bg,
    level: errorLevel,
    imageSettings,
  };

  return (
    <div
      ref={containerRef}
      data-slot="qr-code"
      data-status={status}
      className={cn(
        "relative inline-flex flex-col items-center justify-center select-none overflow-hidden",
        bordered && "rounded-lg border border-border-secondary bg-bg-container p-3",
        className,
      )}
      style={{ width: bordered ? size + 26 : size, height: bordered ? size + 26 : size, ...style }}
      {...props}
    >
      {type === "canvas" ? <QRCodeCanvas {...qrProps} /> : <QRCodeSVG {...qrProps} />}

      {status !== "active" && (
        <div
          data-slot="qr-code-overlay"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-bg-container/92 p-2 text-center text-sm transition-opacity duration-mid"
        >
          {statusRender ? (
            statusRender({ status, onRefresh })
          ) : status === "loading" ? (
            <div className="flex flex-col items-center gap-2 text-text-secondary">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">Loading...</span>
            </div>
          ) : status === "expired" ? (
            <div className="flex flex-col items-center gap-2 text-text-secondary">
              <span className="text-xs text-text-secondary">QR code expired</span>
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover active:text-primary-active"
              >
                <RotateCw className="size-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          ) : status === "scanned" ? (
            <div className="flex flex-col items-center gap-1.5 text-success">
              <CheckCircle2 className="size-6 text-success" />
              <span className="text-xs text-text">Scanned</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
});

export { QRCode };
