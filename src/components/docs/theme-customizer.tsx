import { useState, useEffect } from "react";
import { Palette, Check, RotateCcw, Copy, X } from "lucide-react";
import { useTheme, DEFAULT_PRIMARY } from "@/hooks/use-theme";
import { FONT_STACKS, THEME_PRESETS, tokensToCss } from "@/lib/design-tokens";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLocale, tr } from "@/i18n/locale";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/ui/portal";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useCopy } from "./code-block";

const customizerText = {
  title: tr("ปรับแต่งโทเค็นสี (Theme & Primary Color)", "Customize Theme & Primary Color"),
  desc: tr(
    "เลือกสีพรีเซ็ตหรือกำหนดรหัสสี HEX ที่ต้องการ เพื่อเปลี่ยนสีธีมหลักทั้งระบบแบบเรียลไทม์",
    "Choose a preset or pick a custom HEX color to update the theme tokens across the entire site in real-time.",
  ),
  presets: tr("สีมาตรฐาน (Presets)", "Preset Colors"),
  customColor: tr("กำหนดสีเอง (Custom HEX)", "Custom Color"),
  preview: tr("ตัวอย่างสด (Live Preview)", "Live Preview"),
  reset: tr("รีเซ็ตเป็นค่าเริ่มต้น", "Reset to Default"),
  copyCss: tr("คัดลอก CSS Variables", "Copy CSS Variables"),
  copied: tr("คัดลอกแล้ว!", "Copied!"),
  tokens: tr("โทเคนดีไซน์", "Design tokens"),
  radius: tr("ความมนขอบ", "Corner radius"),
  controlHeight: tr("ความสูงคอนโทรล", "Control height"),
  fontSize: tr("ขนาดตัวอักษร", "Font size"),
  spacing: tr("ระยะห่าง", "Spacing"),
  borderWidth: tr("ความหนาเส้นขอบ", "Border width"),
  motion: tr("ความเร็วอนิเมชัน", "Motion speed"),
  shadow: tr("ความเข้มเงา", "Shadow"),
  font: tr("ฟอนต์", "Typeface"),
  statusColors: tr("สีสถานะ", "Status colours"),
  maskBlur: tr("เบลอฉากหลัง", "Mask blur"),
  themePresets: tr("ชุดธีมสำเร็จรูป", "Theme presets"),
};

export function ThemeCustomizerButton() {
  const [open, setOpen] = useState(false);
  // one hook call for the whole component: calling useTheme() inside a click
  // handler is an invalid hook call, which is why the swatches did nothing
  const { primaryColor, presets, setPrimaryColor, resetPrimaryColor, setTokens } = useTheme();
  const [hexDraft, setHexDraft] = useState(primaryColor);
  useEffect(() => setHexDraft(primaryColor), [primaryColor]);
  const { l } = useLocale();
  // shared counter-based lock so closing this panel never unlocks another open overlay
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors duration-mid hover:bg-fill-tertiary hover:text-primary"
        aria-label="Customize theme tokens"
        title={l(customizerText.title)}
      >
        <Palette className="size-4" />
        <span
          className="size-2.5 rounded-full border border-black/20 dark:border-white/20 shadow-xs"
          style={{ backgroundColor: primaryColor }}
        />
      </button>

      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-50 bg-bg-mask backdrop-blur-xs animate-in fade-in-0 duration-200"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={l(customizerText.title)}
            className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-bg-container p-6 shadow-kk-modal outline-none animate-in fade-in-0 zoom-in-95 duration-200 kk-scrollbar max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-text-heading">
                  <Palette className="size-5 text-primary" />
                  {l(customizerText.title)}
                </div>
                <div className="mt-1 text-xs text-text-secondary">
                  {l(customizerText.desc)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={l(tr("ปิด", "Close"))}
                className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-fill-tertiary hover:text-text"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Whole-look presets */}
              <div>
                <div className="mb-2.5 text-xs font-medium text-text-secondary">{l(customizerText.themePresets)}</div>
                <div className="flex flex-wrap gap-2">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      title={preset.description}
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setTokens(preset.tokens);
                      }}
                      className="kk-hover-pop kk-press flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs text-text transition-colors hover:border-primary"
                    >
                      <span className="size-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets Grid */}
              <div>
                <div className="mb-2.5 text-xs font-medium text-text-secondary">
                  {l(customizerText.presets)}
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {presets.map((p) => {
                    const active = primaryColor.toLowerCase() === p.hex.toLowerCase();
                    return (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => setPrimaryColor(p.hex)}
                        title={`${l(p.name)} (${p.hex})`}
                        className="group relative flex size-9 items-center justify-center rounded-lg border border-black/10 transition-transform duration-mid hover:scale-110 active:scale-95 shadow-xs"
                        style={{ backgroundColor: p.hex }}
                      >
                        {active && <Check className="size-4 text-white drop-shadow-sm" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom HEX picker */}
              <div>
                <div className="mb-2 text-xs font-medium text-text-secondary">
                  {l(customizerText.customColor)}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={hexDraft}
                    onChange={(e) => {
                      const val = e.target.value;
                      // keep partial input editable; apply once a full #rrggbb is typed
                      if (/^#?[0-9a-fA-F]{0,6}$/.test(val)) {
                        setHexDraft(val);
                        if (/^#[0-9a-fA-F]{6}$/.test(val)) setPrimaryColor(val);
                      }
                    }}
                    onBlur={() => setHexDraft(primaryColor)}
                    placeholder="#1677ff"
                    className="h-9 w-32 rounded-md border border-border bg-bg-container px-3 font-mono text-xs text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {primaryColor !== DEFAULT_PRIMARY && (
                    <Button
                      size="sm"
                      variant="text"
                      onClick={() => resetPrimaryColor()}
                      icon={<RotateCcw className="size-3.5" />}
                    >
                      {l(customizerText.reset)}
                    </Button>
                  )}
                </div>
              </div>

              {/* Shape, type, motion and effects */}
              <TokenControls />

              {/* Live Preview Box */}
              <div className="rounded-lg border border-border-secondary bg-bg-layout p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">
                    {l(customizerText.preview)}
                  </span>
                  <Badge count="Active" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button type="primary" size="sm">
                      Primary
                    </Button>
                    <Button size="sm">Default</Button>
                    <Button size="sm" danger>
                      Danger
                    </Button>
                    <Switch defaultChecked size="small" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Tag color="processing">Processing</Tag>
                    <Tag color="success">Success</Tag>
                    <Tag color="warning">Warning</Tag>
                    <Tag color="error">Error</Tag>
                  </div>
                  <Input size="sm" placeholder="Input control" className="max-w-56" />
                </div>
              </div>

              {/* CSS Code generator */}
              <CssGenerator primaryColor={primaryColor} />
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

interface SliderRowProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

function SliderRow({ label, value, min, max, step = 1, suffix = "", onChange }: SliderRowProps) {
  return (
    <label className="flex items-center gap-3 text-xs">
      <span className="w-28 shrink-0 text-text-secondary">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-fill-secondary accent-primary"
      />
      <span className="w-14 shrink-0 text-right font-mono text-text">
        {value}
        {suffix}
      </span>
    </label>
  );
}

/** Everything past the primary colour: shape, type, spacing, motion, effects. */
function TokenControls() {
  const { l } = useLocale();
  const { tokens, setTokens, resetTokens } = useTheme();

  return (
    <div className="space-y-4 rounded-lg border border-border-secondary p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{l(customizerText.tokens)}</span>
        <Button size="sm" variant="text" onClick={resetTokens} icon={<RotateCcw className="size-3.5" />}>
          {l(customizerText.reset)}
        </Button>
      </div>

      <div className="space-y-2.5">
        <SliderRow label={l(customizerText.radius)} value={tokens.radius} min={0} max={20} suffix="px" onChange={(radius) => setTokens({ radius })} />
        <SliderRow
          label={l(customizerText.controlHeight)}
          value={tokens.controlHeight}
          min={24}
          max={48}
          suffix="px"
          onChange={(controlHeight) => setTokens({ controlHeight })}
        />
        <SliderRow label={l(customizerText.fontSize)} value={tokens.fontSize} min={12} max={18} suffix="px" onChange={(fontSize) => setTokens({ fontSize })} />
        <SliderRow label={l(customizerText.spacing)} value={tokens.spacing} min={4} max={14} suffix="px" onChange={(spacing) => setTokens({ spacing })} />
        <SliderRow
          label={l(customizerText.borderWidth)}
          value={tokens.borderWidth}
          min={0}
          max={3}
          suffix="px"
          onChange={(borderWidth) => setTokens({ borderWidth })}
        />
        <SliderRow
          label={l(customizerText.motion)}
          value={tokens.motionScale}
          min={0}
          max={2}
          step={0.1}
          suffix="x"
          onChange={(motionScale) => setTokens({ motionScale })}
        />
        <SliderRow
          label={l(customizerText.maskBlur)}
          value={tokens.maskBlur}
          min={0}
          max={12}
          suffix="px"
          onChange={(maskBlur) => setTokens({ maskBlur })}
        />
        <SliderRow
          label={l(customizerText.shadow)}
          value={tokens.shadowScale}
          min={0}
          max={2}
          step={0.1}
          suffix="x"
          onChange={(shadowScale) => setTokens({ shadowScale })}
        />
      </div>

      <div>
        <div className="mb-1.5 text-xs text-text-secondary">{l(customizerText.font)}</div>
        <div className="flex flex-wrap gap-1.5">
          {FONT_STACKS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setTokens({ fontFamily: f.value })}
              style={{ fontFamily: f.value }}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                tokens.fontFamily === f.value
                  ? "border-primary bg-primary-bg text-primary"
                  : "border-border text-text hover:border-primary",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-xs text-text-secondary">{l(customizerText.statusColors)}</div>
        <div className="flex flex-wrap gap-3">
          {(["success", "warning", "error", "info"] as const).map((key) => (
            <label key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <input
                type="color"
                aria-label={key}
                value={tokens[key]}
                onChange={(e) => setTokens({ [key]: e.target.value } as never)}
                className="size-6 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
              />
              {key}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function CssGenerator({ primaryColor }: { primaryColor: string }) {
  const { l } = useLocale();
  const { tokens } = useTheme();
  const css = tokensToCss(tokens, primaryColor);

  const { copied, copy } = useCopy();

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
          CSS Tokens
        </span>
        <button
          type="button"
          onClick={() => void copy(css)}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {copied ? (
            <>
              <Check className="size-3 text-success" />
              {l(customizerText.copied)}
            </>
          ) : (
            <>
              <Copy className="size-3" />
              {l(customizerText.copyCss)}
            </>
          )}
        </button>
      </div>
      <pre className="kk-scrollbar max-h-28 overflow-x-auto rounded-md bg-bg-container p-2.5 font-mono text-[11px] text-text-secondary border border-border-secondary">
        {css}
      </pre>
    </div>
  );
}
