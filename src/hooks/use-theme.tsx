import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRESET_COLORS, applyPrimaryColor, type ColorPreset } from "@/lib/color-palette";
import { DEFAULT_TOKENS, applyDesignTokens, type DesignTokens } from "@/lib/design-tokens";

export type Theme = "light" | "dark";
const THEME_KEY = "kkui-theme";
const COLOR_KEY = "kkui-primary-color";
const TOKENS_KEY = "kkui-design-tokens";
export const DEFAULT_PRIMARY = "#1677ff";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* ignore */
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function readColor(): string {
  if (typeof document === "undefined") return DEFAULT_PRIMARY;
  try {
    const saved = localStorage.getItem(COLOR_KEY);
    if (saved && /^#[0-9a-fA-F]{6}$/.test(saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_PRIMARY;
}

function readTokens(): DesignTokens {
  if (typeof document === "undefined") return DEFAULT_TOKENS;
  try {
    const saved = localStorage.getItem(TOKENS_KEY);
    if (saved) return { ...DEFAULT_TOKENS, ...(JSON.parse(saved) as Partial<DesignTokens>) };
  } catch {
    /* ignore */
  }
  return DEFAULT_TOKENS;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetPrimaryColor: () => void;
  presets: ColorPreset[];
  /** Radius, control height, type, spacing, motion, shadows and status colours. */
  tokens: DesignTokens;
  setTokens: (patch: Partial<DesignTokens>) => void;
  resetTokens: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [primaryColor, setPrimaryColorState] = useState<string>(readColor);
  const [tokens, setTokensState] = useState<DesignTokens>(readTokens);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    applyPrimaryColor(primaryColor, isDark);
    applyDesignTokens(tokens, isDark);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme, primaryColor, tokens]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setPrimaryColor = useCallback((hex: string) => {
    setPrimaryColorState(hex);
    try {
      localStorage.setItem(COLOR_KEY, hex);
    } catch {
      /* ignore */
    }
  }, []);

  const resetPrimaryColor = useCallback(() => {
    setPrimaryColorState(DEFAULT_PRIMARY);
    try {
      localStorage.removeItem(COLOR_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setTokens = useCallback((patch: Partial<DesignTokens>) => {
    setTokensState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(TOKENS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const resetTokens = useCallback(() => {
    setTokensState(DEFAULT_TOKENS);
    try {
      localStorage.removeItem(TOKENS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggle,
      primaryColor,
      setPrimaryColor,
      resetPrimaryColor,
      presets: PRESET_COLORS,
      tokens,
      setTokens,
      resetTokens,
    }),
    [theme, setTheme, toggle, primaryColor, setPrimaryColor, resetPrimaryColor, tokens, setTokens, resetTokens],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: readTheme(),
      setTheme: () => {},
      toggle: () => {},
      primaryColor: DEFAULT_PRIMARY,
      setPrimaryColor: () => {},
      resetPrimaryColor: () => {},
      tokens: DEFAULT_TOKENS,
      setTokens: () => {},
      resetTokens: () => {},
      presets: PRESET_COLORS,
    };
  }
  return ctx;
}
