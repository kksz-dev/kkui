import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "th" | "en";
/** A value that may be given per language. Plain values are used for both. */
export type Localized<T> = T | { th: T; en: T };

const KEY = "kkui-lang";
const DEFAULT: Lang = "th";

function isLocalized<T>(v: Localized<T>): v is { th: T; en: T } {
  return typeof v === "object" && v !== null && "th" in (v as object) && "en" in (v as object);
}

/** Resolve a Localized value for a language. */
export function resolve<T>(v: Localized<T>, lang: Lang): T {
  return isLocalized(v) ? v[lang] : v;
}

/** Shorthand to author bilingual content: `tr("ไทย", "English")`. */
export const tr = <T,>(th: T, en: T): { th: T; en: T } => ({ th, en });

function read(): Lang {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "th" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return DEFAULT;
}

interface LocaleCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** resolve a Localized value in the current language */
  l: <T>(v: Localized<T>) => T;
}

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(read);
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((v) => (v === "th" ? "en" : "th")), []);
  const value = useMemo<LocaleCtx>(
    () => ({ lang, setLang, toggle, l: <T,>(v: Localized<T>) => resolve(v, lang) }),
    [lang, setLang, toggle],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Allow usage outside the provider (e.g. registry build, tests): default language.
    return { lang: DEFAULT, setLang: () => {}, toggle: () => {}, l: <T,>(v: Localized<T>) => resolve(v, DEFAULT) };
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Site chrome strings                                                 */
/* ------------------------------------------------------------------ */
export const ui = {
  searchPlaceholder: tr("ค้นหาคอมโพเนนต์...", "Search components..."),
  noResults: tr("ไม่พบผลลัพธ์", "No results."),
  navComponents: tr("คอมโพเนนต์", "Components"),
  navIcons: tr("ไอคอน", "Icons"),
  navMotion: tr("แอนิเมชัน", "Motion"),
  navDocs: tr("เอกสาร", "Docs"),
  navDesign: tr("ดีไซน์", "Design"),
  overview: tr("ภาพรวม", "Overview"),
  install: tr("ติดตั้ง", "Install"),
  import: tr("นำเข้า", "Import"),
  whenToUse: tr("ใช้เมื่อไร", "When To Use"),
  examples: tr("ตัวอย่าง", "Examples"),
  api: tr("API", "API"),
  related: tr("ที่เกี่ยวข้อง", "Related"),
  property: tr("พร็อพ", "Property"),
  description: tr("คำอธิบาย", "Description"),
  type: tr("ชนิด", "Type"),
  default: tr("ค่าเริ่มต้น", "Default"),
  copyCode: tr("คัดลอกโค้ด", "Copy code"),
  showCode: tr("แสดงโค้ด", "Show code"),
  hideCode: tr("ซ่อนโค้ด", "Hide code"),
  loading: tr("กำลังโหลด...", "Loading..."),
  notFoundTitle: tr("ไม่พบหน้าที่ต้องการ", "Sorry, the page you visited does not exist."),
  wip: tr("กำลังทำ", "WIP"),
  onThisPage: tr("ในหน้านี้", "On this page"),
  toggleTheme: tr("สลับธีม", "Toggle theme"),
  toggleLang: tr("Switch to English", "เปลี่ยนเป็นภาษาไทย"),
  menu: tr("เมนู", "Menu"),
  componentsCount: tr("คอมโพเนนต์", "components"),
} as const;

/** Sidebar group labels (keys stay English in metadata). */
export const groupLabel: Record<string, { th: string; en: string }> = {
  General: tr("ทั่วไป", "General"),
  Layout: tr("เลย์เอาต์", "Layout"),
  Navigation: tr("นำทาง", "Navigation"),
  "Data Entry": tr("กรอกข้อมูล", "Data Entry"),
  "Data Display": tr("แสดงข้อมูล", "Data Display"),
  Feedback: tr("ตอบกลับ", "Feedback"),
  Other: tr("อื่นๆ", "Other"),
};
