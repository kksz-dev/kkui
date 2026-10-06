import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Horizontal from "./demos/horizontal";
import horizontalCode from "./demos/horizontal.tsx?raw";
import Static from "./demos/static";
import staticCode from "./demos/static.tsx?raw";
import OnClick from "./demos/on-click";
import onClickCode from "./demos/on-click.tsx?raw";
import CustomHighlight from "./demos/custom-highlight";
import customHighlightCode from "./demos/custom-highlight.tsx?raw";
import TargetOffset from "./demos/target-offset";
import targetOffsetCode from "./demos/target-offset.tsx?raw";
import OnChange from "./demos/on-change";
import onChangeCode from "./demos/on-change.tsx?raw";
import Replace from "./demos/replace";
import replaceCode from "./demos/replace.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="anchor"
      imports={["Anchor", "AnchorLink"]}
      whenToUse={
        <>
          <p>
            Anchor lists in-page <code>#hash</code> links and highlights the one whose section is currently in view; clicking a link scrolls
            there smoothly. By default the list is affixed so it stays visible on long pages.
          </p>
          <ul>
            <li>Use it for long documents, settings pages or forms with many sections — anywhere the reader benefits from a table of contents.</li>
            <li>Pass <code>getContainer</code> when the content scrolls inside an element rather than the window.</li>
            <li><code>direction="horizontal"</code> lays the links out as a tab-like bar; nested items are ignored in that mode.</li>
          </ul>
        </>
      }
      demos={[
        { title: "Basic", description: <>The default vertical anchor, affixed at <code>offsetTop</code> while the page scrolls.</>, code: basicCode, component: <Basic />, full: true },
        { title: "Horizontal Anchor", description: <><code>direction="horizontal"</code> with a scrolling <code>getContainer</code>.</>, code: horizontalCode, component: <Horizontal /> },
        { title: "Static Anchor", description: tr(<><code>affix={"{false}"}</code> เรนเดอร์อยู่กับที่และซ่อนแถบ ink; ใส่ <code>showInkInFixed</code> เพื่อให้แถบยังอยู่ ส่วนรายการซ้อนกันได้ด้วย <code>children</code></>, <><code>affix={"{false}"}</code> renders it in place and drops the ink bar; add <code>showInkInFixed</code> to keep it. Items may nest with <code>children</code>.</>), code: staticCode, component: <Static /> },
        { title: "Customize the onClick event", description: <>Intercept clicks with <code>onClick</code>; call <code>preventDefault</code> to skip the built-in scroll.</>, code: onClickCode, component: <OnClick /> },
        { title: "Customize the anchor highlight", description: <><code>getCurrentAnchor</code> decides which link is highlighted.</>, code: customHighlightCode, component: <CustomHighlight /> },
        { title: "Set Anchor scroll offset", description: <><code>targetOffset</code> leaves space above the section when scrolling to it (and when detecting the active link).</>, code: targetOffsetCode, component: <TargetOffset /> },
        { title: "Listening for anchor link change", description: <><code>onChange</code> fires with the new active link.</>, code: onChangeCode, component: <OnChange /> },
        { title: "Replace href in history", description: <><code>replace</code> uses <code>history.replaceState</code> so the back button is not polluted.</>, code: replaceCode, component: <Replace /> },
      ]}
      api={[
        {
          title: "Anchor",
          rows: [
            { property: "affix", description: "Fixed mode of Anchor", type: "boolean", default: "true" },
            { property: "bounds", description: "Bounding distance of anchor area", type: "number", default: "5" },
            { property: "getContainer", description: "Scrolling container", type: "() => HTMLElement | Window", default: "() => window" },
            { property: "getCurrentAnchor", description: "Customize the anchor highlight", type: "(activeLink: string) => string", default: "-" },
            { property: "offsetTop", description: "Pixels to offset from top when calculating position of scroll", type: "number", default: "0" },
            { property: "showInkInFixed", description: tr("แสดงแถบ ink ต่อเมื่อ affix={false} (ปกติแถบจะถูกซ่อนในโหมดนั้น)", "Keep the ink bar when affix={false}; it is hidden in that mode otherwise"), type: "boolean", default: "false" },
            { property: "targetOffset", description: "Anchor scroll offset, default as offsetTop", type: "number", default: "-" },
            { property: "onChange", description: "Listening for anchor link change", type: "(currentActiveLink: string) => void", default: "-" },
            { property: "onClick", description: "Set the handler to handle click event", type: "(e: MouseEvent, link: { title, href }) => void", default: "-" },
            { property: "items", description: "Data configuration option content, support nesting through children", type: "AnchorLinkItem[]", default: "-" },
            { property: "direction", description: "Set Anchor direction", type: "vertical | horizontal", default: "vertical" },
            { property: "replace", description: "Replace items' href in browser history instead of pushing it", type: "boolean", default: "false" },
          ],
        },
        {
          title: "AnchorLinkItem",
          rows: [
            { property: "key", description: "The unique identifier of the Anchor Link", type: "string | number", default: "-" },
            { property: "href", description: "The target of hyperlink", type: "string", default: "-" },
            { property: "target", description: "Specifies where to display the linked URL", type: "string", default: "-" },
            { property: "title", description: "The content of hyperlink", type: "ReactNode", default: "-" },
            { property: "children", description: "Nested Anchor Link, not supported in horizontal direction", type: "AnchorLinkItem[]", default: "-" },
            { property: "replace", description: "Replace item href in browser history instead of pushing it", type: "boolean", default: "false" },
          ],
        },
        {
          title: "AnchorLink",
          description: tr(
            "ทางเลือกแบบ composable แทน `items`: วาง <AnchorLink href title> เป็นลูกของ <Anchor> — เรียกผ่าน `Anchor.Link` ก็ได้",
            "Composable alternative to `items`: render <AnchorLink href title> elements as children of <Anchor>. Also available as `Anchor.Link`.",
          ),
          rows: [
            { property: "href", description: "The target of hyperlink", type: "string", default: "-" },
            { property: "title", description: "The content of hyperlink", type: "ReactNode", default: "-" },
            { property: "target", description: "Specifies where to display the linked URL", type: "string", default: "-" },
            { property: "replace", description: "Replace item href in browser history instead of pushing it", type: "boolean", default: "false" },
          ],
        },
      ]}
      related={[{ title: "Affix", path: "/components/affix" }, { title: "Tabs", path: "/components/tabs" }]}
    />
  );
}
