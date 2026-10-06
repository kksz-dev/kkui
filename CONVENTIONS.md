# KKUI conventions (read before adding a component)

## What KKUI is
A complete enterprise component catalog + docs site (the classic enterprise design-system catalog: General / Layout / Navigation / Data Entry / Data Display / Feedback / Other), built with **Tailwind CSS v4 + KKUI primitives**, all our own code
(cva, `cn()`, one file per component that users copy). Never import a third-party UI kit or depend on an external UI CLI/registry/package; never write CSS-in-JS.

## Files per component `<slug>` (kebab-case, e.g. `date-picker`)
```
src/components/ui/<slug>.tsx                 # the component (+ sub-components) — the only file users copy
src/pages/components/<slug>/metadata.ts      # { title, description, group, order?, keywords? } satisfies RouteMeta
src/pages/components/<slug>/page.tsx         # <ComponentDoc .../> — imports demos + `?raw` sources
src/pages/components/<slug>/demos/<name>.tsx # one demo per file, default export a component, self-contained
```
Routes, sidebar, search and overview are generated from these files automatically — do NOT edit shared files
(router, sidebar, index.css, package.json) unless the task says so.

## Component rules
- `import { cn } from "@/lib/utils"`; variants via `cva`; use KKUI's own accessible primitives for overlays and interactions.
- Props: keep the classic enterprise prop names (`type`, `size="sm|md|lg"`, `danger`, `bordered`, `placement`, `open/onOpenChange`, `value/onChange`, `options`, `disabled`, `loading`, `status="error|warning"`), typed, no `any`. Add `className` passthrough + `data-slot="<slug>"`.
- Sizes: `sm` 24px, `md` 32px, `lg` 40px → utilities `h-control-sm | h-control | h-control-lg`. Base font 14px = `text-sm`.
- Colors ONLY through tokens: `bg-primary text-white`, `bg-primary-bg text-primary`, `border-border`, `text-text-secondary`, `bg-fill-tertiary`, `bg-bg-container`, `bg-bg-elevated`, `text-error`, `bg-success-bg` … (see `src/index.css` @theme). Never hardcode hex except when reproducing a preset palette that already exists as `--color-<preset>`.
- Radius: `rounded-sm` 4 / `rounded-md` 6 / `rounded-lg` 8. Shadow for popups: `shadow-kk`. Motion: `duration-mid ease-kk-in-out`; enter/exit with tw-animate-css (`data-[state=open]:animate-in fade-in-0 zoom-in-95`).
- Dark mode is automatic through tokens — do not add `dark:` classes unless the token cannot express it.
- Sub-components exported flat: `Card, CardGrid, CardMeta` (not `Card.Grid`). Optionally also attach as statics.
- Interactive controls: `useWave` for click ripple on Button/Radio/Checkbox/Switch.
- Focus ring: `focus-visible:ring-[3px] focus-visible:ring-primary/30`. Disabled: `disabled:cursor-not-allowed disabled:text-text-disabled disabled:bg-bg-container-disabled`.
- Imperative APIs (message/notification/Modal.confirm) — implement a tiny store + `<Provider/>` or a root-mounted host; export both hook and static functions.

## Docs page rules
- `page.tsx` renders `<ComponentDoc meta slug imports whenToUse demos api extra? related? />` (see `src/pages/components/button/page.tsx`).
- Cover the standard examples for that component (basic, size, disabled, variants, controlled…), 4–12 demos; `full: true` for wide ones (Table, Layout, Calendar).
- API table rows list every public prop of the component (property / description / type / default).
- Demo files must be self-contained runnable snippets (they are shown verbatim as code). Use lucide-react icons.

## Motion (required — the library should feel alive)

Use the CSS utilities in `src/index.css` — **never add a JS animation package** to a component file:
- `kk-wave` + `useWave()` — click ripple (Button, Radio, Checkbox, Switch)
- `kk-press` — `active:scale-[.98]` press feedback for clickable rows/tiles/icon buttons
- `kk-lift` — hover raise + shadow (cards, tiles, clickable panels)
- `kk-shimmer` — skeleton/loading shimmer
- `kk-pulse-ring` — pulsing ring (Badge processing dot, spotlight)
- `kk-in` (+ `kk-in-up` / `kk-in-down` / `kk-in-zoom`, delay via `--kk-delay`) — mount entrance
- Popups (Dialog/Popover/Tooltip/Dropdown/Drawer/Menu): tw-animate-css data-state classes, e.g.
  `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0`, plus `data-[side=top]:slide-in-from-bottom-2` etc.
- Transitions: `transition-[...] duration-fast|duration-mid|duration-slow ease-kk-in-out|ease-kk-out`
- Moving indicators (Tabs ink bar, Segmented thumb, Steps connector, Slider track, Progress) animate with `transform`/`width` transitions, never layout thrash.
- Everything is automatically disabled under `prefers-reduced-motion` (handled globally in index.css) — do not add your own media query.

## Bilingual docs (required — Thai first)

Docs content is `Localized<T>` = a plain value or `{ th, en }`. Use `tr(thai, english)` from `@/i18n/locale`:
- `metadata.ts` → `description: { th: "...", en: "..." }` (title/keywords stay as-is)
- `page.tsx` → `whenToUse={tr(<>ไทย…</>, <>English…</>)}`,each demo `{ title: tr("ชื่อไทย", "English Title"), description: tr(<>คำอธิบายไทย</>, <>English</>) }`, API rows `description: tr("ไทย", "English")`, `extra`/`related` likewise.
- Anchor ids come from the English title, so keep the English title stable.
- Demo code itself stays English (it is source users copy).

## Verify
`bun run typecheck` and `bun run build` must pass. Open `/components/<slug>` and check light + dark.
