import * as React from "react";
import { cn } from "@/lib/utils";
import { generateTokensFromHex } from "@/lib/color-palette";

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */

/** Design tokens a consumer may override. Maps 1:1 onto the `--kk-*` CSS variables. */
export interface ThemeToken {
  colorPrimary?: string;
  colorSuccess?: string;
  colorWarning?: string;
  colorError?: string;
  colorInfo?: string;
  colorLink?: string;
  colorText?: string;
  colorTextSecondary?: string;
  colorTextTertiary?: string;
  colorTextQuaternary?: string;
  colorBorder?: string;
  colorBorderSecondary?: string;
  colorBgContainer?: string;
  colorBgElevated?: string;
  colorBgLayout?: string;
  colorBgMask?: string;
  borderRadius?: number;
  borderRadiusSM?: number;
  borderRadiusLG?: number;
  fontSize?: number;
  fontSizeSM?: number;
  fontSizeLG?: number;
  fontFamily?: string;
  fontFamilyCode?: string;
  controlHeight?: number;
  controlHeightSM?: number;
  controlHeightLG?: number;
  lineWidth?: number;
  lineHeight?: number;
  motionDurationFast?: string;
  motionDurationMid?: string;
  motionDurationSlow?: string;
  boxShadow?: string;
  wireframe?: boolean;
}

/** An algorithm receives the merged token map and returns overrides. */
export type ThemeAlgorithm = (token: ThemeToken) => ThemeToken;

export const defaultAlgorithm: ThemeAlgorithm = (token) => token;

export const darkAlgorithm: ThemeAlgorithm = (token) => ({
  ...token,
  colorText: token.colorText ?? "rgba(255, 255, 255, 0.88)",
  colorTextSecondary: token.colorTextSecondary ?? "rgba(255, 255, 255, 0.65)",
  colorTextTertiary: token.colorTextTertiary ?? "rgba(255, 255, 255, 0.45)",
  colorTextQuaternary: token.colorTextQuaternary ?? "rgba(255, 255, 255, 0.25)",
  colorBorder: token.colorBorder ?? "#424242",
  colorBorderSecondary: token.colorBorderSecondary ?? "#303030",
  colorBgContainer: token.colorBgContainer ?? "#141414",
  colorBgElevated: token.colorBgElevated ?? "#1f1f1f",
  colorBgLayout: token.colorBgLayout ?? "#000000",
  colorBgMask: token.colorBgMask ?? "rgba(0, 0, 0, 0.65)",
});

export const compactAlgorithm: ThemeAlgorithm = (token) => ({
  ...token,
  controlHeight: token.controlHeight ?? 28,
  controlHeightSM: token.controlHeightSM ?? 22,
  controlHeightLG: token.controlHeightLG ?? 36,
  fontSize: token.fontSize ?? 13,
  borderRadius: token.borderRadius ?? 4,
});

/** Grouped export so `theme.darkAlgorithm` reads the same as the upstream catalog. */
export const theme = {
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
  /** Read the tokens currently in effect (from the nearest ConfigProvider). */
  useToken: useToken,
};

const TOKEN_TO_CSS_VAR: Partial<Record<keyof ThemeToken, string>> = {
  colorSuccess: "--kk-success",
  colorWarning: "--kk-warning",
  colorError: "--kk-error",
  colorInfo: "--kk-info",
  colorLink: "--kk-link",
  colorText: "--kk-text",
  colorTextSecondary: "--kk-text-secondary",
  colorTextTertiary: "--kk-text-tertiary",
  colorTextQuaternary: "--kk-text-quaternary",
  colorBorder: "--kk-border",
  colorBorderSecondary: "--kk-border-secondary",
  colorBgContainer: "--kk-bg-container",
  colorBgElevated: "--kk-bg-elevated",
  colorBgLayout: "--kk-bg-layout",
  colorBgMask: "--kk-bg-mask",
  fontFamily: "--kk-font-family",
  fontFamilyCode: "--kk-font-family-code",
  motionDurationFast: "--kk-motion-fast",
  motionDurationMid: "--kk-motion-mid",
  motionDurationSlow: "--kk-motion-slow",
  boxShadow: "--kk-shadow",
};

const PX_TOKEN_TO_CSS_VAR: Partial<Record<keyof ThemeToken, string>> = {
  borderRadius: "--kk-radius",
  borderRadiusSM: "--kk-radius-sm",
  borderRadiusLG: "--kk-radius-lg",
  fontSize: "--kk-font-size",
  fontSizeSM: "--kk-font-size-sm",
  fontSizeLG: "--kk-font-size-lg",
  controlHeight: "--kk-control-height",
  controlHeightSM: "--kk-control-height-sm",
  controlHeightLG: "--kk-control-height-lg",
  lineWidth: "--kk-line-width",
};

/** Turn a token map into the CSS custom properties the components read. */
export function tokensToCssVars(token: ThemeToken): Record<string, string> {
  const vars: Record<string, string> = {};

  if (token.colorPrimary) {
    const g = generateTokensFromHex(token.colorPrimary);
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    vars["--kk-primary"] = isDark ? g.darkPrimary : g.primary;
    vars["--kk-primary-hover"] = isDark ? g.darkPrimaryHover : g.primaryHover;
    vars["--kk-primary-active"] = isDark ? g.darkPrimaryActive : g.primaryActive;
    vars["--kk-primary-bg"] = isDark ? g.darkPrimaryBg : g.primaryBg;
    vars["--kk-primary-bg-hover"] = isDark ? g.darkPrimaryBorder : g.primaryBgHover;
    vars["--kk-primary-border"] = isDark ? g.darkPrimaryBorder : g.primaryBorder;
    vars["--kk-primary-border-hover"] = isDark ? g.darkPrimaryActive : g.primaryBorderHover;
    vars["--kk-primary-text"] = isDark ? g.darkPrimary : g.primaryText;
    vars["--kk-primary-text-hover"] = isDark ? g.darkPrimaryHover : g.primaryTextHover;
    vars["--kk-primary-text-active"] = isDark ? g.darkPrimaryActive : g.primaryTextActive;
    vars["--kk-link"] = isDark ? g.darkPrimary : g.primary;
    vars["--primary"] = isDark ? g.darkPrimary : g.primary;
    vars["--ring"] = isDark ? g.darkPrimary : g.primary;
  }

  for (const [key, cssVar] of Object.entries(TOKEN_TO_CSS_VAR)) {
    const value = token[key as keyof ThemeToken];
    if (typeof value === "string") vars[cssVar] = value;
  }

  for (const [key, cssVar] of Object.entries(PX_TOKEN_TO_CSS_VAR)) {
    const value = token[key as keyof ThemeToken];
    if (typeof value === "number") vars[cssVar] = `${value}px`;
  }

  if (typeof token.lineHeight === "number") vars["--kk-line-height"] = String(token.lineHeight);
  if (token.wireframe) vars["--kk-shadow"] = "none";

  return vars;
}

/* ------------------------------------------------------------------ */
/* locale                                                              */
/* ------------------------------------------------------------------ */

export interface KkLocale {
  locale: string;
  Empty: { description: string };
  Table: {
    filterTitle: string;
    filterConfirm: string;
    filterReset: string;
    filterEmptyText: string;
    selectAll: string;
    selectInvert: string;
    selectNone: string;
    sortTitle: string;
    triggerAsc: string;
    triggerDesc: string;
    cancelSort: string;
    emptyText: string;
  };
  Modal: { okText: string; cancelText: string; justOkText: string };
  Popconfirm: { okText: string; cancelText: string };
  Transfer: { titles: [string, string]; searchPlaceholder: string; itemUnit: string; itemsUnit: string; remove: string; selectAll: string; selectInvert: string };
  Select: { notFoundContent: string; placeholder: string };
  Upload: { uploading: string; removeFile: string; uploadError: string; previewFile: string; downloadFile: string };
  Pagination: { itemsPerPage: string; jumpTo: string; page: string; total: string };
  Form: { optional: string; defaultValidateMessages: { required: string; types: { email: string; url: string; number: string } } };
  DatePicker: { today: string; now: string; ok: string; placeholder: string; rangePlaceholder: [string, string] };
}

export const enUS: KkLocale = {
  locale: "en",
  Empty: { description: "No data" },
  Table: {
    filterTitle: "Filter menu",
    filterConfirm: "OK",
    filterReset: "Reset",
    filterEmptyText: "No filters",
    selectAll: "Select current page",
    selectInvert: "Invert current page",
    selectNone: "Clear all data",
    sortTitle: "Sort",
    triggerAsc: "Click to sort ascending",
    triggerDesc: "Click to sort descending",
    cancelSort: "Click to cancel sorting",
    emptyText: "No data",
  },
  Modal: { okText: "OK", cancelText: "Cancel", justOkText: "OK" },
  Popconfirm: { okText: "OK", cancelText: "Cancel" },
  Transfer: {
    titles: ["Source", "Target"],
    searchPlaceholder: "Search here",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Remove",
    selectAll: "Select all data",
    selectInvert: "Invert current page",
  },
  Select: { notFoundContent: "Not found", placeholder: "Please select" },
  Upload: {
    uploading: "Uploading…",
    removeFile: "Remove file",
    uploadError: "Upload error",
    previewFile: "Preview file",
    downloadFile: "Download file",
  },
  Pagination: { itemsPerPage: "/ page", jumpTo: "Go to", page: "Page", total: "Total" },
  Form: {
    optional: "(optional)",
    defaultValidateMessages: {
      required: "${label} is required",
      types: { email: "${label} is not a valid email", url: "${label} is not a valid url", number: "${label} is not a valid number" },
    },
  },
  DatePicker: { today: "Today", now: "Now", ok: "OK", placeholder: "Select date", rangePlaceholder: ["Start date", "End date"] },
};

export const thTH: KkLocale = {
  locale: "th",
  Empty: { description: "ไม่มีข้อมูล" },
  Table: {
    filterTitle: "ตัวกรอง",
    filterConfirm: "ตกลง",
    filterReset: "ล้าง",
    filterEmptyText: "ไม่มีตัวกรอง",
    selectAll: "เลือกทั้งหน้า",
    selectInvert: "สลับการเลือก",
    selectNone: "ล้างทั้งหมด",
    sortTitle: "เรียงลำดับ",
    triggerAsc: "คลิกเพื่อเรียงจากน้อยไปมาก",
    triggerDesc: "คลิกเพื่อเรียงจากมากไปน้อย",
    cancelSort: "คลิกเพื่อยกเลิกการเรียง",
    emptyText: "ไม่มีข้อมูล",
  },
  Modal: { okText: "ตกลง", cancelText: "ยกเลิก", justOkText: "ตกลง" },
  Popconfirm: { okText: "ตกลง", cancelText: "ยกเลิก" },
  Transfer: {
    titles: ["ต้นทาง", "ปลายทาง"],
    searchPlaceholder: "ค้นหา",
    itemUnit: "รายการ",
    itemsUnit: "รายการ",
    remove: "นำออก",
    selectAll: "เลือกทั้งหมด",
    selectInvert: "สลับการเลือก",
  },
  Select: { notFoundContent: "ไม่พบข้อมูล", placeholder: "กรุณาเลือก" },
  Upload: {
    uploading: "กำลังอัปโหลด…",
    removeFile: "ลบไฟล์",
    uploadError: "อัปโหลดไม่สำเร็จ",
    previewFile: "ดูตัวอย่าง",
    downloadFile: "ดาวน์โหลด",
  },
  Pagination: { itemsPerPage: "/ หน้า", jumpTo: "ไปที่", page: "หน้า", total: "ทั้งหมด" },
  Form: {
    optional: "(ไม่บังคับ)",
    defaultValidateMessages: {
      required: "กรุณากรอก ${label}",
      types: { email: "${label} ไม่ใช่อีเมลที่ถูกต้อง", url: "${label} ไม่ใช่ URL ที่ถูกต้อง", number: "${label} ไม่ใช่ตัวเลข" },
    },
  },
  DatePicker: { today: "วันนี้", now: "ตอนนี้", ok: "ตกลง", placeholder: "เลือกวันที่", rangePlaceholder: ["วันเริ่มต้น", "วันสิ้นสุด"] },
};

/* ------------------------------------------------------------------ */
/* context                                                             */
/* ------------------------------------------------------------------ */

export type ComponentSize = "sm" | "md" | "lg";
export type DirectionType = "ltr" | "rtl";

export interface ConfigConsumerProps {
  componentSize: ComponentSize;
  componentDisabled: boolean;
  direction: DirectionType;
  locale: KkLocale;
  token: ThemeToken;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  getTargetContainer?: () => HTMLElement;
  renderEmpty?: (componentName?: string) => React.ReactNode;
  space: { size: ComponentSize | number };
  form: { requiredMark?: boolean | "optional"; colon?: boolean };
  wave: { disabled: boolean };
}

const DEFAULT_CONFIG: ConfigConsumerProps = {
  componentSize: "md",
  componentDisabled: false,
  direction: "ltr",
  locale: enUS,
  token: {},
  space: { size: "md" },
  form: {},
  wave: { disabled: false },
};

const ConfigContext = React.createContext<ConfigConsumerProps | null>(null);

/** Read the effective config. Safe outside a provider — returns the defaults. */
export function useConfig(): ConfigConsumerProps {
  return React.useContext(ConfigContext) ?? DEFAULT_CONFIG;
}

/** Resolve a component-level size against the provider default. */
export function useComponentSize(size?: ComponentSize): ComponentSize {
  const { componentSize } = useConfig();
  return size ?? componentSize;
}

/** Resolve a component-level `disabled` against the provider default. */
export function useComponentDisabled(disabled?: boolean): boolean {
  const { componentDisabled } = useConfig();
  return disabled ?? componentDisabled;
}

/** Locale accessor with a per-component fallback. */
export function useLocale<K extends keyof KkLocale>(component: K): KkLocale[K] {
  const { locale } = useConfig();
  return locale[component];
}

/** The tokens currently in effect. */
export function useToken(): { token: ThemeToken } {
  const { token } = useConfig();
  return { token };
}

/* ------------------------------------------------------------------ */
/* provider                                                            */
/* ------------------------------------------------------------------ */

export interface ConfigProviderProps {
  children?: React.ReactNode;
  /** Design tokens, algorithm(s) and per-component overrides. */
  theme?: {
    token?: ThemeToken;
    algorithm?: ThemeAlgorithm | ThemeAlgorithm[];
    components?: Record<string, ThemeToken>;
    /** Inherit tokens from a parent provider (default true). */
    inherit?: boolean;
  };
  /** Default size for every control below this provider. */
  componentSize?: ComponentSize;
  /** Disable every control below this provider. */
  componentDisabled?: boolean;
  direction?: DirectionType;
  locale?: KkLocale;
  /** Where popups (dropdown / select / date picker) are mounted. */
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  getTargetContainer?: () => HTMLElement;
  /** Custom empty state used by Table / List / Select when there is no data. */
  renderEmpty?: (componentName?: string) => React.ReactNode;
  space?: { size: ComponentSize | number };
  form?: { requiredMark?: boolean | "optional"; colon?: boolean };
  wave?: { disabled: boolean };
  /**
   * Write the resolved tokens onto `:root` instead of a wrapper element.
   * Defaults to true for the outermost provider so portalled popups inherit them.
   */
  applyToRoot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ConfigProvider({
  children,
  theme: themeConfig,
  componentSize,
  componentDisabled,
  direction,
  locale,
  getPopupContainer,
  getTargetContainer,
  renderEmpty,
  space,
  form,
  wave,
  applyToRoot,
  className,
  style,
}: ConfigProviderProps) {
  const parent = React.useContext(ConfigContext);
  const isRoot = parent === null;
  const writeToRoot = applyToRoot ?? isRoot;

  const resolvedToken = React.useMemo(() => {
    const inherit = themeConfig?.inherit !== false;
    const base = inherit && parent ? parent.token : {};
    let merged: ThemeToken = { ...base, ...themeConfig?.token };
    const algorithms = themeConfig?.algorithm
      ? Array.isArray(themeConfig.algorithm)
        ? themeConfig.algorithm
        : [themeConfig.algorithm]
      : [];
    for (const algorithm of algorithms) merged = algorithm(merged);
    return merged;
  }, [themeConfig, parent]);

  const cssVars = React.useMemo(() => tokensToCssVars(resolvedToken), [resolvedToken]);

  React.useLayoutEffect(() => {
    if (!writeToRoot) return;
    const root = document.documentElement;
    const previous = new Map<string, string>();
    for (const [name, value] of Object.entries(cssVars)) {
      previous.set(name, root.style.getPropertyValue(name));
      root.style.setProperty(name, value);
    }
    return () => {
      for (const [name, value] of previous) {
        if (value) root.style.setProperty(name, value);
        else root.style.removeProperty(name);
      }
    };
  }, [cssVars, writeToRoot]);

  const value = React.useMemo<ConfigConsumerProps>(
    () => ({
      componentSize: componentSize ?? parent?.componentSize ?? DEFAULT_CONFIG.componentSize,
      componentDisabled: componentDisabled ?? parent?.componentDisabled ?? DEFAULT_CONFIG.componentDisabled,
      direction: direction ?? parent?.direction ?? DEFAULT_CONFIG.direction,
      locale: locale ?? parent?.locale ?? DEFAULT_CONFIG.locale,
      token: resolvedToken,
      getPopupContainer: getPopupContainer ?? parent?.getPopupContainer,
      getTargetContainer: getTargetContainer ?? parent?.getTargetContainer,
      renderEmpty: renderEmpty ?? parent?.renderEmpty,
      space: space ?? parent?.space ?? DEFAULT_CONFIG.space,
      form: form ?? parent?.form ?? DEFAULT_CONFIG.form,
      wave: wave ?? parent?.wave ?? DEFAULT_CONFIG.wave,
    }),
    [
      componentSize,
      componentDisabled,
      direction,
      locale,
      resolvedToken,
      getPopupContainer,
      getTargetContainer,
      renderEmpty,
      space,
      form,
      wave,
      parent,
    ],
  );

  const content = (
    <div
      data-slot="config-provider"
      dir={value.direction}
      className={cn("contents", className)}
      style={writeToRoot ? style : { ...cssVars, ...style }}
    >
      {children}
    </div>
  );

  return <ConfigContext.Provider value={value}>{content}</ConfigContext.Provider>;
}

ConfigProvider.useConfig = useConfig;
ConfigProvider.ConfigContext = ConfigContext;
