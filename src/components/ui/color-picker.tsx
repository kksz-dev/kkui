import * as React from "react";
import { Portal } from "@/components/ui/portal";
import { useClickOutside } from "@/hooks/use-click-outside";
import { computeFloatingPosition, measureFloating, toContainerCoords } from "@/lib/floating-position";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ColorFormat = "hex" | "rgb" | "hsb";
export type ColorPickerSize = "sm" | "md" | "lg";

export interface ColorPreset {
  label: React.ReactNode;
  colors: string[];
  defaultOpen?: boolean;
}

export interface ColorPickerProps
  extends Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange"> {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  onChangeComplete?: (color: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  disabledAlpha?: boolean;
  disabledFormat?: boolean;
  allowClear?: boolean;
  showText?: boolean | ((color: string) => React.ReactNode);
  size?: ColorPickerSize;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  presets?: ColorPreset[];
  placement?:
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "left"
    | "right";
  trigger?: "click" | "hover";
  arrow?: boolean;
  panelRender?: (
    panel: React.ReactNode,
    extra: {
      components: {
        Picker: React.ComponentType;
        Presets: React.ComponentType;
      };
    },
  ) => React.ReactNode;
}

// Helpers for color conversions
function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  let c = hex.trim().replace(/^#/, "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("") + "ff";
  } else if (c.length === 4) {
    c = c.split("").map((x) => x + x).join("");
  } else if (c.length === 6) {
    c = c + "ff";
  } else if (c.length !== 8) {
    c = "1677ffff";
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 24) & 255,
    g: (num >> 16) & 255,
    b: (num >> 8) & 255,
    a: Math.round(((num & 255) / 255) * 100) / 100,
  };
}

function rgbToHex(r: number, g: number, b: number, a = 1): string {
  const clamp = (n: number, max: number) => Math.max(0, Math.min(max, Math.round(n)));
  const rHex = clamp(r, 255).toString(16).padStart(2, "0");
  const gHex = clamp(g, 255).toString(16).padStart(2, "0");
  const bHex = clamp(b, 255).toString(16).padStart(2, "0");
  if (a >= 1) return `#${rHex}${gHex}${bHex}`;
  const aHex = clamp(a * 255, 255).toString(16).padStart(2, "0");
  return `#${rHex}${gHex}${bHex}${aHex}`;
}

function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else if (max === b) h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.round(max * 100);
  return { h, s, b: v };
}

function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  };
}

/** Pointer capture shared by the saturation square and both sliders. */
function useDragTrack(onMove: (ratioX: number, ratioY: number) => void, onCommit: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);

  const emit = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    onMove(x, y);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    emit(e.clientX, e.clientY);

    const move = (ev: PointerEvent) => emit(ev.clientX, ev.clientY);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      onCommit();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return { ref, onPointerDown };
}

function SaturationArea({
  hue,
  saturation,
  brightness,
  onChange,
  onCommit,
}: {
  hue: number;
  saturation: number;
  brightness: number;
  onChange: (s: number, b: number) => void;
  onCommit: () => void;
}) {
  const { ref, onPointerDown } = useDragTrack((x, y) => onChange(Math.round(x * 100), Math.round((1 - y) * 100)), onCommit);

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Saturation and brightness"
      aria-valuetext={`${saturation}% saturation, ${brightness}% brightness`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowRight") onChange(Math.min(100, saturation + step), brightness);
        else if (e.key === "ArrowLeft") onChange(Math.max(0, saturation - step), brightness);
        else if (e.key === "ArrowUp") onChange(saturation, Math.min(100, brightness + step));
        else if (e.key === "ArrowDown") onChange(saturation, Math.max(0, brightness - step));
        else return;
        e.preventDefault();
        onCommit();
      }}
      className="relative h-32 w-full cursor-crosshair rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
    >
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black to-transparent" />
      <span
        aria-hidden
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
        style={{ left: `${saturation}%`, top: `${100 - brightness}%` }}
      />
    </div>
  );
}

function TrackSlider({
  value,
  max,
  label,
  trackClassName,
  trackStyle,
  thumbColor,
  onChange,
  onCommit,
}: {
  value: number;
  max: number;
  label: string;
  trackClassName?: string;
  trackStyle?: React.CSSProperties;
  thumbColor: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}) {
  const { ref, onPointerDown } = useDragTrack((x) => onChange(Math.round(x * max)), onCommit);

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={(e) => {
        const step = (e.shiftKey ? 10 : 1) * (max / 100);
        if (e.key === "ArrowRight") onChange(Math.min(max, value + step));
        else if (e.key === "ArrowLeft") onChange(Math.max(0, value - step));
        else return;
        e.preventDefault();
        onCommit();
      }}
      className={cn("relative h-3 w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40", trackClassName)}
      style={trackStyle}
    >
      <span
        aria-hidden
        className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
        style={{ left: `${(value / max) * 100}%`, backgroundColor: thumbColor }}
      />
    </div>
  );
}

function normalizeHex(input: string, defaultColor = "#1677ff"): string {
  if (!input) return defaultColor;
  let hex = input.trim();
  if (!hex.startsWith("#")) hex = "#" + hex;
  return hex;
}

function ColorPicker({
  value,
  defaultValue = "#1677ff",
  onChange,
  onChangeComplete,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  disabledAlpha = false,
  disabledFormat = false,
  allowClear = false,
  showText,
  size = "md",
  format: formatProp,
  defaultFormat = "hex",
  onFormatChange,
  presets,
  placement = "bottomLeft",
  trigger = "click",
  arrow = true,
  panelRender,
  className,
  getPopupContainer,
  ...props
}: ColorPickerProps) {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const [innerValue, setInnerValue] = React.useState(defaultValue);
  const [innerFormat, setInnerFormat] = React.useState<ColorFormat>(defaultFormat);

  const isOpen = openProp !== undefined ? openProp : innerOpen;
  const rawValue = value !== undefined ? value : innerValue;
  // an empty string is a real state — "no colour chosen" — not a reason to fall back
  const isCleared = rawValue === "";
  const currentColor = normalizeHex(rawValue);
  const currentFormat = formatProp !== undefined ? formatProp : innerFormat;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp === undefined) setInnerOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const handleColorChange = (nextColor: string) => {
    if (value === undefined) setInnerValue(nextColor);
    onChange?.(nextColor);
  };

  const handleColorCommit = (nextColor: string) => {
    onChangeComplete?.(nextColor);
  };

  const handleFormatChange = (nextFmt: ColorFormat) => {
    if (formatProp === undefined) setInnerFormat(nextFmt);
    onFormatChange?.(nextFmt);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleColorChange("");
    handleColorCommit("");
  };

  // Convert current color to parsed representations
  const rgba = React.useMemo(() => hexToRgb(currentColor), [currentColor]);
  const hsb = React.useMemo(() => rgbToHsb(rgba.r, rgba.g, rgba.b), [rgba]);

  // Picker component for panelRender
  const PickerComp = () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5">
        <SaturationArea
          hue={hsb.h}
          saturation={hsb.s}
          brightness={hsb.b}
          onChange={(sat, bri) => {
            const next = hsbToRgb(hsb.h, sat, bri);
            handleColorChange(rgbToHex(next.r, next.g, next.b, rgba.a));
          }}
          onCommit={() => handleColorCommit(currentColor)}
        />

        <TrackSlider
          label="Hue"
          value={hsb.h}
          max={360}
          thumbColor={`hsl(${hsb.h}, 100%, 50%)`}
          trackStyle={{
            background:
              "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
          }}
          onChange={(hue) => {
            const next = hsbToRgb(hue, hsb.s, hsb.b);
            handleColorChange(rgbToHex(next.r, next.g, next.b, rgba.a));
          }}
          onCommit={() => handleColorCommit(currentColor)}
        />

        {!disabledAlpha && (
          <div className="rounded-full bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)] [background-size:8px_8px] dark:bg-[repeating-conic-gradient(#374151_0%_25%,#1f2937_0%_50%)]">
            <TrackSlider
              label="Alpha"
              value={Math.round(rgba.a * 100)}
              max={100}
              thumbColor={currentColor}
              trackStyle={{
                background: `linear-gradient(to right, ${rgbToHex(rgba.r, rgba.g, rgba.b, 0)}, ${rgbToHex(rgba.r, rgba.g, rgba.b, 1)})`,
              }}
              onChange={(alpha) => handleColorChange(rgbToHex(rgba.r, rgba.g, rgba.b, alpha / 100))}
              onCommit={() => handleColorCommit(currentColor)}
            />
          </div>
        )}
      </div>

      {/* Format Controls */}
      {!disabledFormat && (
        <div className="flex flex-col gap-2 border-t border-border-secondary pt-2">
          <div className="flex items-center gap-1">
            <select
              aria-label="Color format"
              className="h-6 rounded border border-border bg-bg-container px-1.5 text-xs text-text outline-none cursor-pointer hover:border-primary focus:border-primary"
              value={currentFormat}
              onChange={(e) => handleFormatChange(e.target.value as ColorFormat)}
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsb">HSB</option>
            </select>

            {currentFormat === "hex" && (
              <div className="flex flex-1 items-center gap-1">
                <input
                  aria-label="Hex color value"
                  className="h-6 flex-1 rounded border border-border bg-bg-container px-1.5 font-mono text-xs text-text outline-none focus:border-primary"
                  value={currentColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,8}$/.test(val)) {
                      handleColorChange(val);
                    }
                  }}
                />
                {!disabledAlpha && (
                  <div className="flex items-center gap-0.5">
                    <input
                      aria-label="Alpha percentage"
                      type="number"
                      min={0}
                      max={100}
                      className="h-6 w-12 rounded border border-border bg-bg-container px-1 text-center font-mono text-xs text-text outline-none focus:border-primary"
                      value={Math.round(rgba.a * 100)}
                      onChange={(e) => {
                        const alpha = Number(e.target.value) / 100;
                        handleColorChange(rgbToHex(rgba.r, rgba.g, rgba.b, alpha));
                      }}
                    />
                    <span className="text-xs text-text-tertiary">%</span>
                  </div>
                )}
              </div>
            )}

            {currentFormat === "rgb" && (
              <div className="grid flex-1 grid-cols-3 gap-1">
                {(["r", "g", "b"] as const).map((k) => (
                  <input
                    key={k}
                    aria-label={`RGB ${k.toUpperCase()}`}
                    type="number"
                    min={0}
                    max={255}
                    className="h-6 rounded border border-border bg-bg-container px-1 text-center font-mono text-xs text-text outline-none focus:border-primary"
                    value={rgba[k]}
                    onChange={(e) => {
                      const nextVal = Number(e.target.value);
                      const nextRgb = { ...rgba, [k]: nextVal };
                      handleColorChange(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, rgba.a));
                    }}
                  />
                ))}
              </div>
            )}

            {currentFormat === "hsb" && (
              <div className="grid flex-1 grid-cols-3 gap-1">
                <input
                  aria-label="HSB Hue"
                  type="number"
                  min={0}
                  max={360}
                  className="h-6 rounded border border-border bg-bg-container px-1 text-center font-mono text-xs text-text outline-none focus:border-primary"
                  value={hsb.h}
                  onChange={(e) => {
                    const nextH = Number(e.target.value);
                    const nextRgb = hsbToRgb(nextH, hsb.s, hsb.b);
                    handleColorChange(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, rgba.a));
                  }}
                />
                <input
                  aria-label="HSB Saturation"
                  type="number"
                  min={0}
                  max={100}
                  className="h-6 rounded border border-border bg-bg-container px-1 text-center font-mono text-xs text-text outline-none focus:border-primary"
                  value={hsb.s}
                  onChange={(e) => {
                    const nextS = Number(e.target.value);
                    const nextRgb = hsbToRgb(hsb.h, nextS, hsb.b);
                    handleColorChange(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, rgba.a));
                  }}
                />
                <input
                  aria-label="HSB Brightness"
                  type="number"
                  min={0}
                  max={100}
                  className="h-6 rounded border border-border bg-bg-container px-1 text-center font-mono text-xs text-text outline-none focus:border-primary"
                  value={hsb.b}
                  onChange={(e) => {
                    const nextB = Number(e.target.value);
                    const nextRgb = hsbToRgb(hsb.h, hsb.s, nextB);
                    handleColorChange(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b, rgba.a));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Presets component for panelRender
  const PresetsComp = () => {
    if (!presets || presets.length === 0) return null;
    return (
      <div className="flex flex-col gap-2 border-t border-border-secondary pt-2">
        {presets.map((preset, pIdx) => (
          <div key={pIdx} className="flex flex-col gap-1.5">
            <div className="text-xs font-medium text-text-secondary">{preset.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {preset.colors.map((c, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  aria-label={`Preset color ${c}`}
                  className={cn(
                    "relative size-5 shrink-0 rounded border border-border/40 transition-transform duration-fast hover:scale-110",
                    currentColor.toLowerCase() === c.toLowerCase() && "ring-2 ring-primary ring-offset-1",
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    handleColorChange(c);
                    handleColorCommit(c);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const defaultPanel = (
    <div className="flex flex-col gap-3">
      <PickerComp />
      <PresetsComp />
    </div>
  );

  const panelContent = panelRender
    ? panelRender(defaultPanel, {
        components: {
          Picker: PickerComp,
          Presets: PresetsComp,
        },
      })
    : defaultPanel;

  // Text representation in trigger
  const renderedText = React.useMemo(() => {
    if (!showText) return null;
    if (typeof showText === "function") return showText(currentColor);
    if (currentFormat === "rgb") {
      return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b}${!disabledAlpha && rgba.a < 1 ? `, ${rgba.a}` : ""})`;
    }
    if (currentFormat === "hsb") {
      return `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
    }
    return currentColor.toUpperCase();
  }, [showText, currentColor, currentFormat, rgba, hsb, disabledAlpha]);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const popupContainer = React.useMemo(
    () => (getPopupContainer ? getPopupContainer(triggerRef.current) : undefined),
    [getPopupContainer, isOpen], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useClickOutside(popupRef, (e) => {
    if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
    handleOpenChange(false);
  }, isOpen);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const cRect = measureFloating(popupRef.current);
    setPos(toContainerCoords(computeFloatingPosition(tRect, cRect, placement, 6), popupContainer));
  }, [placement, popupContainer]);

  React.useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      const onScrollOrResize = () => updatePosition();
      window.addEventListener("scroll", onScrollOrResize, true);
      window.addEventListener("resize", onScrollOrResize);
      return () => {
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
      };
    }
  }, [isOpen, updatePosition]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-slot="color-picker"
        disabled={disabled}
        onClick={() => trigger === "click" && handleOpenChange(!isOpen)}
        onMouseEnter={trigger === "hover" ? () => handleOpenChange(true) : undefined}
        onMouseLeave={trigger === "hover" ? () => handleOpenChange(false) : undefined}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-border bg-bg-container text-text select-none",
          "transition-[border-color,box-shadow] duration-mid ease-kk-in-out",
          "outline-none hover:border-primary-hover focus-visible:ring-[3px] focus-visible:ring-primary/30",
          size === "sm" ? "h-control-sm px-1.5 text-xs" : size === "lg" ? "h-control-lg px-2.5 text-base" : "h-control px-2 text-sm",
          disabled && "cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled hover:border-border",
          className,
        )}
        {...props}
      >
        {/* Swatch */}
        <span
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded border border-border/50",
            "bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)] [background-size:8px_8px] dark:bg-[repeating-conic-gradient(#374151_0%_25%,#1f2937_0%_50%)]",
            size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4",
          )}
        >
          {isCleared ? (
            <span aria-hidden className="absolute inset-0 flex items-center justify-center text-[10px] text-error">
              /
            </span>
          ) : (
            <span className="absolute inset-0" style={{ backgroundColor: currentColor }} />
          )}
        </span>

        {/* Optional Text */}
        {renderedText && <span className="truncate">{renderedText}</span>}

        {/* Clear button if allowClear */}
        {allowClear && !isCleared && !disabled ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear color"
            onClick={handleClear}
            className="text-text-tertiary hover:text-text"
          >
            <X className="size-3" />
          </span>
        ) : null}
      </button>

      {isOpen && (
        <Portal container={popupContainer}>
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex: 1050,
            }}
            onMouseEnter={trigger === "hover" ? () => handleOpenChange(true) : undefined}
            onMouseLeave={trigger === "hover" ? () => handleOpenChange(false) : undefined}
            className={cn(
              "z-50 w-64 rounded-lg border border-border bg-bg-elevated p-3 shadow-kk",
              "animate-in fade-in-0 zoom-in-95 duration-200 ease-kk-spring-soft",
            )}
          >
            {arrow && (
              <span
                aria-hidden
                className={cn(
                  "absolute size-2 rotate-45 border border-border bg-bg-elevated",
                  placement.startsWith("top")
                    ? "-bottom-1 border-l-0 border-t-0"
                    : placement.startsWith("bottom")
                      ? "-top-1 border-b-0 border-r-0"
                      : placement === "left"
                        ? "-right-1 border-b-0 border-l-0"
                        : "-left-1 border-r-0 border-t-0",
                  placement.endsWith("Right") ? "right-4" : placement.startsWith("top") || placement.startsWith("bottom") ? "left-4" : "top-4",
                )}
              />
            )}
            {panelContent}
          </div>
        </Portal>
      )}
    </>
  );
}

export { ColorPicker };
