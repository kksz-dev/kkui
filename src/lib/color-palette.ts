/**
 * Color palette generation and presets for KKUI token customizer.
 * Takes any base hex and produces light/dark tokens for --kk-primary-*.
 */

export interface ColorPreset {
  name: { th: string; en: string };
  hex: string;
}

export const PRESET_COLORS: ColorPreset[] = [
  { name: { th: "Daybreak Blue (มาตรฐาน)", en: "Daybreak Blue (Default)" }, hex: "#1677ff" },
  { name: { th: "Geek Blue", en: "Geek Blue" }, hex: "#2f54eb" },
  { name: { th: "Golden Purple", en: "Golden Purple" }, hex: "#722ed1" },
  { name: { th: "Magenta", en: "Magenta" }, hex: "#eb2f96" },
  { name: { th: "Volcano", en: "Volcano" }, hex: "#fa541c" },
  { name: { th: "Sunset Orange", en: "Sunset Orange" }, hex: "#fa8c16" },
  { name: { th: "Sunrise Gold", en: "Sunrise Gold" }, hex: "#faad14" },
  { name: { th: "Lime", en: "Lime" }, hex: "#a0d911" },
  { name: { th: "Polar Green", en: "Polar Green" }, hex: "#52c41a" },
  { name: { th: "Cyan", en: "Cyan" }, hex: "#13c2c2" },
  { name: { th: "Dust Red", en: "Dust Red" }, hex: "#f5222d" },
  { name: { th: "Emerald", en: "Emerald" }, hex: "#10b981" },
  { name: { th: "Violet", en: "Violet" }, hex: "#8b5cf6" },
  { name: { th: "Rose", en: "Rose" }, hex: "#f43f5e" },
  { name: { th: "Sky", en: "Sky" }, hex: "#0ea5e9" },
  { name: { th: "Indigo", en: "Indigo" }, hex: "#6366f1" },
];

export interface GeneratedTokens {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryBg: string;
  primaryBgHover: string;
  primaryBorder: string;
  primaryBorderHover: string;
  primaryText: string;
  primaryTextHover: string;
  primaryTextActive: string;
  // dark variants
  darkPrimary: string;
  darkPrimaryHover: string;
  darkPrimaryActive: string;
  darkPrimaryBg: string;
  darkPrimaryBgHover: string;
  darkPrimaryBorder: string;
  darkPrimaryBorderHover: string;
}

// Convert Hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  let c = hex.replace(/^#/, "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateTokensFromHex(baseHex: string): GeneratedTokens {
  const [h, s, l] = hexToHsl(baseHex);

  const primary = baseHex.toLowerCase();
  const primaryHover = hslToHex(h, Math.min(100, s + 5), Math.min(85, l + 10));
  const primaryActive = hslToHex(h, Math.min(100, s + 10), Math.max(20, l - 12));

  const primaryBg = hslToHex(h, Math.min(100, s * 0.9), 96);
  const primaryBgHover = hslToHex(h, Math.min(100, s * 0.9), 90);
  const primaryBorder = hslToHex(h, Math.min(100, s * 0.9), 80);
  const primaryBorderHover = hslToHex(h, Math.min(100, s * 0.9), 68);

  const darkPrimary = hslToHex(h, Math.min(100, s + 5), Math.max(45, Math.min(65, l)));
  const darkPrimaryHover = hslToHex(h, Math.min(100, s + 5), Math.min(75, l + 8));
  const darkPrimaryActive = hslToHex(h, Math.min(100, s + 10), Math.max(35, l - 8));
  const darkPrimaryBg = hslToHex(h, Math.max(20, s * 0.7), 12);
  const darkPrimaryBgHover = hslToHex(h, Math.max(20, s * 0.7), 18);
  const darkPrimaryBorder = hslToHex(h, Math.max(30, s * 0.7), 26);
  const darkPrimaryBorderHover = hslToHex(h, Math.max(30, s * 0.7), 34);

  return {
    primary,
    primaryHover,
    primaryActive,
    primaryBg,
    primaryBgHover,
    primaryBorder,
    primaryBorderHover,
    primaryText: primary,
    primaryTextHover: primaryHover,
    primaryTextActive: primaryActive,
    darkPrimary,
    darkPrimaryHover,
    darkPrimaryActive,
    darkPrimaryBg,
    darkPrimaryBgHover,
    darkPrimaryBorder,
    darkPrimaryBorderHover,
  };
}

export function applyPrimaryColor(hex: string, isDark = false) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const tokens = generateTokensFromHex(hex);

  if (isDark) {
    root.style.setProperty("--kk-primary", tokens.darkPrimary);
    root.style.setProperty("--kk-primary-hover", tokens.darkPrimaryHover);
    root.style.setProperty("--kk-primary-active", tokens.darkPrimaryActive);
    root.style.setProperty("--kk-primary-bg", tokens.darkPrimaryBg);
    root.style.setProperty("--kk-primary-bg-hover", tokens.darkPrimaryBgHover);
    root.style.setProperty("--kk-primary-border", tokens.darkPrimaryBorder);
    root.style.setProperty("--kk-primary-border-hover", tokens.darkPrimaryBorderHover);
    root.style.setProperty("--kk-primary-text", tokens.darkPrimary);
    root.style.setProperty("--kk-primary-text-hover", tokens.darkPrimaryHover);
    root.style.setProperty("--kk-primary-text-active", tokens.darkPrimaryActive);
    root.style.setProperty("--kk-link", tokens.darkPrimary);
    root.style.setProperty("--kk-link-hover", tokens.darkPrimaryHover);
    root.style.setProperty("--kk-link-active", tokens.darkPrimaryActive);
    root.style.setProperty("--primary", tokens.darkPrimary);
    root.style.setProperty("--ring", tokens.darkPrimary);
  } else {
    root.style.setProperty("--kk-primary", tokens.primary);
    root.style.setProperty("--kk-primary-hover", tokens.primaryHover);
    root.style.setProperty("--kk-primary-active", tokens.primaryActive);
    root.style.setProperty("--kk-primary-bg", tokens.primaryBg);
    root.style.setProperty("--kk-primary-bg-hover", tokens.primaryBgHover);
    root.style.setProperty("--kk-primary-border", tokens.primaryBorder);
    root.style.setProperty("--kk-primary-border-hover", tokens.primaryBorderHover);
    root.style.setProperty("--kk-primary-text", tokens.primaryText);
    root.style.setProperty("--kk-primary-text-hover", tokens.primaryTextHover);
    root.style.setProperty("--kk-primary-text-active", tokens.primaryTextActive);
    root.style.setProperty("--kk-link", tokens.primary);
    root.style.setProperty("--kk-link-hover", tokens.primaryHover);
    root.style.setProperty("--kk-link-active", tokens.primaryActive);
    root.style.setProperty("--primary", tokens.primary);
    root.style.setProperty("--ring", tokens.primary);
  }
}
