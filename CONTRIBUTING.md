# Contributing to KKUI

Thanks for helping. Bug reports, docs fixes, new demos and new components are all welcome.

## Before you start

- For a new component or a breaking prop change, open an issue first so we can agree on the API.
- Small fixes (typos, a broken demo, a styling bug) can go straight to a pull request.

## Setup

```bash
bun install
bun run dev
```

The docs site runs at http://localhost:5180. Every component page there is also its test bench.

## Adding or changing a component

[CONVENTIONS.md](CONVENTIONS.md) is the rulebook. The short version:

- One file per component in `src/components/ui/<slug>.tsx`. No new runtime dependencies without discussion.
- Colors only through tokens. No hardcoded hex, no CSS-in-JS.
- A docs folder in `src/pages/components/<slug>/` with `metadata.ts`, `page.tsx` and one file per demo.
- The API table lists every public prop.

## Pull requests

1. Branch from `main`.
2. Run `bun run build`. It builds the registry, type-checks and bundles. CI runs the same command.
3. Describe what changed and add a screenshot for anything visual (light and dark mode if colors are involved).

By contributing you agree that your work is released under the [MIT License](LICENSE).
