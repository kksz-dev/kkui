import type { Localized } from "@/i18n/locale";

/** Sidebar groups. */
export const COMPONENT_GROUPS = [
  "General",
  "Layout",
  "Navigation",
  "Data Entry",
  "Data Display",
  "Feedback",
  "Other",
] as const;

export type ComponentGroup = (typeof COMPONENT_GROUPS)[number];

/** `metadata.ts` next to every `page.tsx` under src/pages/components/<slug>/ */
export interface RouteMeta {
  /** Display title, e.g. "Button" */
  title: string;
  /** One-line description shown in sidebar tooltip / overview cards (plain string or { th, en }) */
  description: Localized<string>;
  /** Sidebar group */
  group: ComponentGroup;
  /** Sort order inside the group (lower first). Defaults to alphabetical. */
  order?: number;
  /** Optional emoji/keyword list to improve search */
  keywords?: string[];
  /** Mark as work-in-progress; still routed, shown with a badge */
  wip?: boolean;
}

export interface ApiRow {
  property: string;
  description: Localized<string>;
  type: string;
  default?: Localized<string>;
  version?: string;
}

export interface ApiSection {
  /** e.g. "Button", "ButtonGroup" */
  title: string;
  description?: Localized<string>;
  rows: ApiRow[];
}

export type DemoSize = "compact" | "standard" | "wide" | "full";

export interface DemoItem {
  /** Section title of the example */
  title: Localized<string>;
  /** Short explanation shown under the preview */
  description?: Localized<React.ReactNode>;
  /** Raw source, usually `import code from "./demos/basic.tsx?raw"` */
  code: string;
  /** Rendered preview */
  component: React.ReactNode;
  /** Width of this card in the responsive example grid. */
  size?: DemoSize;
  /** @deprecated Use `size: "full"`. */
  full?: boolean;
  /** Custom background for the preview area (e.g. "bg-bg-layout") */
  background?: string;
  /** Per-demo preview sizing/alignment without changing the demo component. */
  previewClassName?: string;
}
