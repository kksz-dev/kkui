# QA scripts

Headless checks that drive the docs site through the Chrome DevTools Protocol.
They need the dev server running (`bun run dev`) and a Chromium-family browser;
set `KKUI_BROWSER` if it is somewhere unusual.

| command | what it does |
| --- | --- |
| `bun run qa:scan` | visits every component page, fails on console errors or a page that barely rendered |
| `bun run qa:interact` | clicks, hovers and types through 26 components, asserting the visible result |
| `bun run qa:anim` | records frame intervals through modal, drawer, collapse, tabs, dropdown, carousel, navigation and scrolling; flags anything past 20 ms |
| `bun scripts/qa/shot.ts <url> <out.png> [js] [waitMs] [preloadJs]` | screenshot, optionally after running a snippet (`FULLPAGE=1` for the whole page) |

`qa:scan` takes the paths to visit; with none it falls back to whatever you pass:

```
bun run qa:scan $(ls -d src/pages/components/*/ | sed 's|src/pages/components/|/components/|; s|/$||')
bun run qa:interact            # all cases
bun run qa:interact switch     # only cases whose name contains "switch"
```
