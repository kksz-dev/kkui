# KKUI

An enterprise React component set built on Tailwind CSS v4. 90 components, 750+ live demos, Thai and English docs.

**Docs:** https://kkui.kksz.dev

KKUI is not an npm package. You copy the component source into your app and own it from then on, the same way you would copy a file from a colleague. The CLI does the copying for you and installs the few dependencies a component needs.

## Use it in your project

Requires React 19, Tailwind CSS v4 and [Bun](https://bun.sh).

```bash
# once per project: design tokens, cn() helper, shared hooks
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - init

# then add what you need
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add button table date-picker

# see everything that is available
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - list
```

Options: `--dir src` (where `components/ui`, `hooks`, `lib` live), `--force` (overwrite), `--no-install` (print deps instead of running `bun add`).

Prefer not to pipe a script into your shell? Every component page on the docs site links to its source file, and the raw registry lives at `https://kkui.kksz.dev/r/<name>.json`.

## What is in the box

| Group | Components |
|---|---|
| General | 4 |
| Layout | 8 |
| Navigation | 12 |
| Data Entry | 20 |
| Data Display | 28 |
| Feedback | 12 |
| Other | 6 |

Things every component shares:

- Colors, radius, shadows and motion come from CSS tokens in `src/index.css` (`--kk-*`), so dark mode and the theme customizer work without extra classes.
- Props follow familiar enterprise naming: `size="sm|md|lg"`, `status`, `disabled`, `loading`, `open/onOpenChange`, `value/onChange`.
- Accessible overlays and keyboard handling are built in, with no third-party UI kit underneath.
- One file per component. What you copy is what runs.

## Develop KKUI itself

```bash
bun install
bun run dev        # http://localhost:5180
bun run build      # registry, then tsc, then vite build into dist/
```

Project layout:

- `src/components/ui/*.tsx`: the components (the files users copy)
- `src/pages/components/<slug>/`: docs page, metadata and demos for each component. Routes, sidebar and search are generated from these.
- `scripts/build-registry.ts`: builds `public/r/*` from the components
- `public/cli.ts`: the CLI source

Read [CONVENTIONS.md](CONVENTIONS.md) before adding a component, and [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE) © Saksit Chokchai
