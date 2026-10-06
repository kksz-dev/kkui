import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Gutter from "./demos/gutter";
import gutterCode from "./demos/gutter.tsx?raw";
import Offset from "./demos/offset";
import offsetCode from "./demos/offset.tsx?raw";
import Sort from "./demos/sort";
import sortCode from "./demos/sort.tsx?raw";
import Flex from "./demos/flex";
import flexCode from "./demos/flex.tsx?raw";
import FlexAlign from "./demos/flex-align";
import flexAlignCode from "./demos/flex-align.tsx?raw";
import FlexOrder from "./demos/flex-order";
import flexOrderCode from "./demos/flex-order.tsx?raw";
import FlexFill from "./demos/flex-fill";
import flexFillCode from "./demos/flex-fill.tsx?raw";
import Responsive from "./demos/responsive";
import responsiveCode from "./demos/responsive.tsx?raw";
import ResponsiveMore from "./demos/responsive-more";
import responsiveMoreCode from "./demos/responsive-more.tsx?raw";
import UseBreakpoint from "./demos/use-breakpoint";
import useBreakpointCode from "./demos/use-breakpoint.tsx?raw";
import Playground from "./demos/playground";
import playgroundCode from "./demos/playground.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="grid"
      imports={["Row", "Col", "useBreakpoint"]}
      whenToUse={
        <>
          <p>
            The grid splits the horizontal space into 24 aliquots. Lay out a page by nesting <code>Row</code> and <code>Col</code>: a <code>Row</code> is a flex
            container, each <code>Col</code> takes a fraction of it with <code>span</code>, and columns wrap when their spans exceed 24.
          </p>
          <ul>
            <li>Use <code>gutter</code> on the row for horizontal / vertical spacing between columns.</li>
            <li>Use <code>offset</code>, <code>push</code>, <code>pull</code>, <code>order</code> to shift or reorder columns.</li>
            <li>Six breakpoints (<code>xs sm md lg xl xxl</code>) accept a number or a size object for responsive layouts.</li>
            <li>Under the hood everything is flexbox with inline percentages, so it works inside any container.</li>
          </ul>
        </>
      }
      demos={[
        { title: "Basic Grid", description: <>From the stack to the horizontal arrangement — <code>Row</code> and <code>Col</code> spans that add up to 24 fill the width.</>, code: basicCode, component: <Basic />, full: true },
        { title: "Grid Gutter", description: <><code>gutter</code> as a number, a responsive object, or <code>[horizontal, vertical]</code>.</>, code: gutterCode, component: <Gutter />, full: true },
        { title: "Column Offset", description: <><code>offset</code> shifts a column to the right by that many grid units.</>, code: offsetCode, component: <Offset /> },
        { title: "Grid Sort", description: <><code>push</code> and <code>pull</code> move columns visually without changing DOM order.</>, code: sortCode, component: <Sort /> },
        { title: "Flex Layout", description: <><code>justify</code> controls how child columns are distributed horizontally.</>, code: flexCode, component: <Flex />, full: true },
        { title: "Flex Alignment", description: <><code>align</code> controls vertical alignment of columns of different heights.</>, code: flexAlignCode, component: <FlexAlign /> },
        { title: "Flex Order", description: <>Change the visual order via <code>order</code>, also per breakpoint.</>, code: flexOrderCode, component: <FlexOrder /> },
        { title: "Flex Fill", description: <><code>flex</code> accepts a number (ratio), a length (fixed width) or a raw <code>flex</code> value.</>, code: flexFillCode, component: <FlexFill /> },
        { title: "Responsive", description: <>Set a different span or size object per breakpoint: <code>xs</code> &lt;576, <code>sm</code> ≥576, <code>md</code> ≥768, <code>lg</code> ≥992, <code>xl</code> ≥1200, <code>xxl</code> ≥1600.</>, code: responsiveCode, component: <Responsive /> },
        { title: "Responsive More", description: tr(<><code>justify</code> และ <code>align</code> รับอ็อบเจกต์แยกตาม breakpoint ได้ เช่น <code>{"align={{ xs: 'top', md: 'middle' }}"}</code></>, <><code>justify</code> and <code>align</code> also accept a per-breakpoint object, e.g. <code>{"align={{ xs: 'top', md: 'middle' }}"}</code>.</>), code: responsiveMoreCode, component: <ResponsiveMore />, full: true },
        { title: "useBreakpoint Hook", description: <>Read the current screens map with <code>useBreakpoint()</code>.</>, code: useBreakpointCode, component: <UseBreakpoint /> },
        { title: "Playground", description: <>Play with gutter and column count.</>, code: playgroundCode, component: <Playground />, full: true },
      ]}
      api={[
        {
          title: "Row",
          rows: [
            { property: "align", description: tr("การจัดแนวตั้ง รับค่าเดียวหรืออ็อบเจกต์ต่อ breakpoint เช่น { xs: 'top', md: 'middle' }", "Vertical alignment; a plain value or a per-breakpoint object like { xs: 'top', md: 'middle' }"), type: "top | middle | bottom | stretch | object", default: "top" },
            { property: "gutter", description: "Spacing between grids, could be a number or an object like { xs: 8, sm: 16, md: 24}. Or you can use array to set vertical spacing [horizontal, vertical]", type: "number | object | array", default: "0" },
            { property: "justify", description: tr("การจัดแนวนอน รับค่าเดียวหรืออ็อบเจกต์ต่อ breakpoint เช่น { xs: 'center', md: 'end' }", "Horizontal arrangement; a plain value or a per-breakpoint object like { xs: 'center', md: 'end' }"), type: "start | end | center | space-around | space-between | space-evenly | object", default: "start" },
            { property: "wrap", description: "Auto wrap line", type: "boolean", default: "true" },
          ],
        },
        {
          title: "Col",
          rows: [
            { property: "flex", description: "Flex layout style", type: "string | number", default: "-" },
            { property: "offset", description: "The number of cells to offset Col from the left", type: "number", default: "0" },
            { property: "order", description: "Raster order", type: "number", default: "0" },
            { property: "pull", description: "The number of cells that raster is moved to the left", type: "number", default: "0" },
            { property: "push", description: "The number of cells that raster is moved to the right", type: "number", default: "0" },
            { property: "span", description: "Raster number of cells to occupy, 0 corresponds to display: none", type: "number", default: "none" },
            { property: "xs", description: "screen < 576px and also default setting, could be a span value or an object containing above props", type: "number | object", default: "-" },
            { property: "sm", description: "screen ≥ 576px, could be a span value or an object containing above props", type: "number | object", default: "-" },
            { property: "md", description: "screen ≥ 768px, could be a span value or an object containing above props", type: "number | object", default: "-" },
            { property: "lg", description: "screen ≥ 992px, could be a span value or an object containing above props", type: "number | object", default: "-" },
            { property: "xl", description: "screen ≥ 1200px, could be a span value or an object containing above props", type: "number | object", default: "-" },
            { property: "xxl", description: "screen ≥ 1600px, could be a span value or an object containing above props", type: "number | object", default: "-" },
          ],
        },
        {
          title: "useBreakpoint",
          description: "Hook returning `{ xs, sm, md, lg, xl, xxl }` booleans (min-width matches, xs = max-width 575px). Empty object before the first effect.",
          rows: [{ property: "return", description: "Current matching breakpoints", type: "Partial<Record<Breakpoint, boolean>>", default: "{}" }],
        },
      ]}
      related={[{ title: "Layout", path: "/components/layout" }, { title: "Flex", path: "/components/flex" }, { title: "Space", path: "/components/space" }]}
    />
  );
}
