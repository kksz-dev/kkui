import { generateTokensFromHex } from "@/lib/color-palette";

/**
 * Everything the theme editor can change beyond the primary colour. Each field
 * maps onto the `--kk-*` custom properties the components already read, so a
 * change here reaches every component without touching their code.
 */
export interface DesignTokens {
  /** Base corner radius in px; the xs / sm / lg steps scale from it. */
  radius: number;
  /** Height of a default control in px; sm / lg / xs scale from it. */
  controlHeight: number;
  /** Base font size in px. */
  fontSize: number;
  fontFamily: string;
  /** Multiplies every motion duration. 0 turns animation off. */
  motionScale: number;
  /** Multiplies shadow opacity. 0 is a flat, wireframe-ish look. */
  shadowScale: number;
  /** Base spacing unit in px, used by `--kk-padding*`. */
  spacing: number;
  /** Border width for inputs, cards and dividers. */
  borderWidth: number;
  /** Blur behind modal / drawer masks, in px. Default 0: a full-screen blur
   *  costs frames on every open, and the dim alone reads just as well. */
  maskBlur: number;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const DEFAULT_TOKENS: DesignTokens = {
  radius: 6,
  controlHeight: 32,
  fontSize: 14,
  // identical to --kk-font-family in index.css (applied inline on load, so any drift would win over the stylesheet)
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "IBM Plex Sans Thai", "Noto Sans Thai", "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  motionScale: 1,
  shadowScale: 1,
  spacing: 8,
  borderWidth: 1,
  maskBlur: 0,
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  info: "#1677ff",
};

export interface ThemePreset {
  key: string;
  label: string;
  description: string;
  primary: string;
  tokens: Partial<DesignTokens>;
}

/**
 * Whole looks, not just colours. Each preset is a starting point the sliders can
 * still move; "Reset" returns to KKUI Default.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    key: "kkui",
    label: "KKUI Default",
    description: "Compact enterprise density, 6px radius, system type.",
    primary: "#1677ff",
    tokens: { ...DEFAULT_TOKENS },
  },
  {
    key: "myui",
    label: "MyUI",
    description: "Indigo, rounder corners, roomier controls and larger type.",
    primary: "#1c69e3",
    tokens: {
      radius: 12,
      controlHeight: 40,
      fontSize: 16,
      spacing: 8,
      borderWidth: 1,
      motionScale: 1.1,
      shadowScale: 1.2,
      maskBlur: 0,
      fontFamily: '"Geist Variable", Geist, "Noto Sans Thai", system-ui, sans-serif',
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#de3b3d",
      info: "#1c69e3",
    },
  },
  {
    key: "soft",
    label: "Soft",
    description: "Pill controls, gentle shadows, slower motion.",
    primary: "#7c3aed",
    tokens: {
      radius: 16,
      controlHeight: 38,
      fontSize: 15,
      spacing: 9,
      borderWidth: 1,
      motionScale: 1.3,
      shadowScale: 1.5,
      maskBlur: 4,
      fontFamily: '"IBM Plex Sans", "IBM Plex Sans Thai", system-ui, sans-serif',
    },
  },
  {
    key: "compact",
    label: "Compact",
    description: "Dense tables and forms: small radius, tight spacing, quick motion.",
    primary: "#0958d9",
    tokens: {
      radius: 4,
      controlHeight: 28,
      fontSize: 13,
      spacing: 6,
      borderWidth: 1,
      motionScale: 0.7,
      shadowScale: 0.6,
      maskBlur: 0,
      fontFamily: DEFAULT_TOKENS.fontFamily,
    },
  },
  {
    key: "flat",
    label: "Flat",
    description: "No shadows, square corners, instant motion — wireframe mode.",
    primary: "#111827",
    tokens: {
      radius: 2,
      controlHeight: 32,
      fontSize: 14,
      spacing: 8,
      borderWidth: 1,
      motionScale: 0,
      shadowScale: 0,
      maskBlur: 0,
      fontFamily: DEFAULT_TOKENS.fontFamily,
    },
  },
];

export interface FontStack {
  label: string;
  value: string;
  /** Google Fonts family names to fetch the first time this stack is used. */
  webfont?: string;
}

export const FONT_STACKS: FontStack[] = [
  { label: "System", value: DEFAULT_TOKENS.fontFamily },
  { label: "Geist", value: '"Geist Variable", Geist, "Noto Sans Thai", system-ui, sans-serif', webfont: "Geist:wght@300..700" },
  { label: "Inter", value: 'Inter, "Noto Sans Thai", system-ui, sans-serif', webfont: "Inter:wght@300..700" },
  { label: "IBM Plex", value: '"IBM Plex Sans", "IBM Plex Sans Thai", system-ui, sans-serif', webfont: "IBM+Plex+Sans:wght@300;400;500;600;700" },
  { label: "Sarabun", value: 'Sarabun, "Noto Sans Thai", system-ui, sans-serif', webfont: "Sarabun:wght@300;400;500;600;700" },
  { label: "Geometric", value: '"Poppins", "Noto Sans Thai", system-ui, sans-serif', webfont: "Poppins:wght@300;400;500;600;700" },
  { label: "Mono", value: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace', webfont: "JetBrains+Mono:wght@300..700" },
];

const loadedFonts = new Set<string>();

/** Fetch a stack's webfont the first time it is selected, never on load. */
export function ensureWebfont(fontFamily: string) {
  if (typeof document === "undefined") return;
  const stack = FONT_STACKS.find((f) => f.value === fontFamily);
  if (!stack?.webfont || loadedFonts.has(stack.webfont)) return;
  loadedFonts.add(stack.webfont);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${stack.webfont}&display=swap`;
  document.head.appendChild(link);
}

/** Semantic colours get the same hover / active / bg family as the primary. */
function applyStatusColor(root: HTMLElement, name: "success" | "warning" | "error" | "info", hex: string, isDark: boolean) {
  const t = generateTokensFromHex(hex);
  root.style.setProperty(`--kk-${name}`, isDark ? t.darkPrimary : t.primary);
  root.style.setProperty(`--kk-${name}-hover`, isDark ? t.darkPrimaryHover : t.primaryHover);
  root.style.setProperty(`--kk-${name}-active`, isDark ? t.darkPrimaryActive : t.primaryActive);
  root.style.setProperty(`--kk-${name}-bg`, isDark ? t.darkPrimaryBg : t.primaryBg);
  root.style.setProperty(`--kk-${name}-border`, isDark ? t.darkPrimaryBorder : t.primaryBorder);
}

const SHADOW_BASE = {
  shadow: [0.08, 0.12, 0.05],
  secondary: [0.08, 0.12, 0.05],
  tertiary: [0.04, 0.08, 0.03],
} as const;

/** Write the overrides onto :root. Values equal to the default are removed. */
export function applyDesignTokens(tokens: DesignTokens, isDark = false) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const set = (name: string, value: string | null) => {
    if (value === null) root.style.removeProperty(name);
    else root.style.setProperty(name, value);
  };

  // shape
  const r = tokens.radius;
  set("--kk-radius-xs", `${Math.max(0, Math.round(r * 0.34))}px`);
  set("--kk-radius-sm", `${Math.max(0, Math.round(r * 0.67))}px`);
  set("--kk-radius", `${r}px`);
  set("--kk-radius-lg", `${Math.round(r * 1.34)}px`);

  const h = tokens.controlHeight;
  set("--kk-control-height-xs", `${Math.round(h * 0.5)}px`);
  set("--kk-control-height-sm", `${Math.round(h * 0.75)}px`);
  set("--kk-control-height", `${h}px`);
  set("--kk-control-height-lg", `${Math.round(h * 1.25)}px`);

  // typography
  const f = tokens.fontSize;
  ensureWebfont(tokens.fontFamily);
  set("--kk-font-family", tokens.fontFamily);
  set("--kk-font-size-sm", `${Math.round(f * 0.86)}px`);
  set("--kk-font-size", `${f}px`);
  set("--kk-font-size-lg", `${Math.round(f * 1.14)}px`);
  set("--kk-font-size-xl", `${Math.round(f * 1.43)}px`);
  set("--kk-font-size-h1", `${Math.round(f * 2.71)}px`);
  set("--kk-font-size-h2", `${Math.round(f * 2.14)}px`);
  set("--kk-font-size-h3", `${Math.round(f * 1.71)}px`);
  set("--kk-font-size-h4", `${Math.round(f * 1.43)}px`);
  set("--kk-font-size-h5", `${Math.round(f * 1.14)}px`);

  // spacing: one unit feeds every Tailwind p-* / m-* / gap-* step
  set("--kk-spacing-unit", `${(tokens.spacing / 8) * 0.25}rem`);

  set("--kk-line-width", `${tokens.borderWidth}px`);
  set("--kk-mask-blur", `${tokens.maskBlur}px`);

  // motion
  const m = tokens.motionScale;
  set("--kk-motion-fast", `${(0.1 * m).toFixed(3)}s`);
  set("--kk-motion-mid", `${(0.2 * m).toFixed(3)}s`);
  set("--kk-motion-slow", `${(0.3 * m).toFixed(3)}s`);

  // shadows
  const k = tokens.shadowScale;
  const a = (base: number) => (base * k).toFixed(3);
  set(
    "--kk-shadow",
    `0 6px 16px 0 rgba(0,0,0,${a(SHADOW_BASE.shadow[0])}), 0 3px 6px -4px rgba(0,0,0,${a(SHADOW_BASE.shadow[1])}), 0 9px 28px 8px rgba(0,0,0,${a(SHADOW_BASE.shadow[2])})`,
  );
  set(
    "--kk-shadow-secondary",
    `0 6px 16px 0 rgba(0,0,0,${a(SHADOW_BASE.secondary[0])}), 0 3px 6px -4px rgba(0,0,0,${a(SHADOW_BASE.secondary[1])})`,
  );
  set("--kk-shadow-tertiary", `0 1px 2px 0 rgba(0,0,0,${a(SHADOW_BASE.tertiary[0])}), 0 1px 6px -1px rgba(0,0,0,${a(SHADOW_BASE.tertiary[1])})`);

  // semantic colours
  applyStatusColor(root, "success", tokens.success, isDark);
  applyStatusColor(root, "warning", tokens.warning, isDark);
  applyStatusColor(root, "error", tokens.error, isDark);
  applyStatusColor(root, "info", tokens.info, isDark);
}

/** The CSS the editor offers for copying. */
export function tokensToCss(tokens: DesignTokens, primary: string): string {
  const p = generateTokensFromHex(primary);
  const lines = [
    `--kk-primary: ${p.primary};`,
    `--kk-primary-hover: ${p.primaryHover};`,
    `--kk-primary-active: ${p.primaryActive};`,
    `--kk-primary-bg: ${p.primaryBg};`,
    `--kk-primary-border: ${p.primaryBorder};`,
    `--kk-success: ${tokens.success};`,
    `--kk-warning: ${tokens.warning};`,
    `--kk-error: ${tokens.error};`,
    `--kk-info: ${tokens.info};`,
    `--kk-radius: ${tokens.radius}px;`,
    `--kk-control-height: ${tokens.controlHeight}px;`,
    `--kk-font-size: ${tokens.fontSize}px;`,
    `--kk-font-family: ${tokens.fontFamily};`,
    `--kk-spacing-unit: ${((tokens.spacing / 8) * 0.25).toFixed(3)}rem;`,
    `--kk-line-width: ${tokens.borderWidth}px;`,
    `--kk-mask-blur: ${tokens.maskBlur}px;`,
    `--kk-motion-mid: ${(0.2 * tokens.motionScale).toFixed(3)}s;`,
  ];
  return `:root {\n  ${lines.join("\n  ")}\n}`;
}
