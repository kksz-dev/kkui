import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import WithIcon from "./demos/with-icon";
import withIconCode from "./demos/with-icon.tsx?raw";
import Separator from "./demos/separator";
import separatorCode from "./demos/separator.tsx?raw";
import SeparatorNode from "./demos/separator-node";
import separatorNodeCode from "./demos/separator-node.tsx?raw";
import Overlay from "./demos/overlay";
import overlayCode from "./demos/overlay.tsx?raw";
import ReactRouter from "./demos/react-router";
import reactRouterCode from "./demos/react-router.tsx?raw";
import SeparatorIndependent from "./demos/separator-independent";
import separatorIndependentCode from "./demos/separator-independent.tsx?raw";
import Composable from "./demos/composable";
import composableCode from "./demos/composable.tsx?raw";
import Debug from "./demos/debug";
import debugCode from "./demos/debug.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="breadcrumb"
      imports={["Breadcrumb", "BreadcrumbItem", "BreadcrumbSeparator"]}
      whenToUse={
        <>
          <p>A breadcrumb displays the current location within a hierarchy. It allows going back to states higher up in the hierarchy.</p>
          <ul>
            <li>When the system has more than two layers in a hierarchy.</li>
            <li>When you need to inform the user of where they are.</li>
            <li>When the user may need to navigate back to a higher level.</li>
          </ul>
        </>
      }
      demos={[
        { title: "Basic Usage", description: "The simplest use.", code: basicCode, component: <Basic /> },
        { title: "With an Icon", description: "The icon should be placed in front of the text.", code: withIconCode, component: <WithIcon /> },
        { title: "Configuring the Separator", description: <>Use <code>separator="&gt;"</code> to change the separator string.</>, code: separatorCode, component: <Separator /> },
        { title: "Separator Node", description: <><code>separator</code> also accepts a React node.</>, code: separatorNodeCode, component: <SeparatorNode /> },
        { title: "Bread crumbs with drop down menu", description: tr(<>ใส่ <code>menu</code> ให้รายการเพื่อเปิด dropdown ของพี่น้อง และปรับตำแหน่ง/พฤติกรรมด้วย <code>dropdownProps</code></>, <>Give an item a <code>menu</code> to show a dropdown of siblings, and tune it with <code>dropdownProps</code>.</>), code: overlayCode, component: <Overlay /> },
        { title: "react-router integration", description: <>Put a <code>&lt;Link&gt;</code> in <code>title</code>; the breadcrumb follows the current route.</>, code: reactRouterCode, component: <ReactRouter /> },
        { title: "Configuring the Separator Independently", description: <>Insert <code>{`{ type: "separator" }`}</code> items to control each separator on its own.</>, code: separatorIndependentCode, component: <SeparatorIndependent /> },
        { title: "Composable", description: <>Hand-written markup with <code>BreadcrumbItem</code> and <code>BreadcrumbSeparator</code>.</>, code: composableCode, component: <Composable /> },
        { title: "Debug Routes", description: <><code>path</code> segments are joined and <code>:params</code> replaced; long lists wrap.</>, code: debugCode, component: <Debug /> },
      ]}
      api={[
        {
          title: "Breadcrumb",
          rows: [
            { property: "itemRender", description: "Custom item renderer", type: "(route, params, routes, paths) => ReactNode", default: "-" },
            { property: "params", description: "Routing parameters, `:id` in `path` is replaced", type: "object", default: "-" },
            { property: "items", description: "The routing stack information of router", type: "ItemType[]", default: "-" },
            { property: "separator", description: "Custom separator", type: "ReactNode", default: "/" },
            { property: "className", description: "Extra classes on the nav element", type: "string", default: "-" },
          ],
        },
        {
          title: "ItemType",
          rows: [
            { property: "className", description: "The additional css class", type: "string", default: "-" },
            { property: "dropdownProps", description: tr("พร็อพที่ส่งต่อให้ Dropdown ของรายการนี้ (placement, trigger, arrow, open/onOpenChange ฯลฯ)", "Props forwarded to this item's Dropdown (placement, trigger, arrow, open/onOpenChange, ...)"), type: "Omit<DropdownProps, 'menu' | 'children'>", default: "-" },
            { property: "href", description: "Target of hyperlink. Cannot be used with `path`", type: "string", default: "-" },
            { property: "path", description: "Connected path. Each path will connect with previous path", type: "string", default: "-" },
            { property: "menu", description: "The menu shown in a dropdown", type: "{ items: { label, href?, disabled?, onClick? }[] }", default: "-" },
            { property: "onClick", description: "Set the handler to handle click event", type: "(e) => void", default: "-" },
            { property: "title", description: "Item content", type: "ReactNode", default: "-" },
            { property: "type", description: "Set to `separator` to render a separator item", type: "separator", default: "-" },
            { property: "separator", description: "Custom separator (with type=separator)", type: "ReactNode", default: "/" },
          ],
        },
        {
          title: "BreadcrumbItem",
          rows: [
            { property: "href", description: "Renders an anchor", type: "string", default: "-" },
            { property: "menu", description: "Dropdown menu", type: "{ items }", default: "-" },
            { property: "dropdownProps", description: tr("พร็อพที่ส่งต่อให้ Dropdown", "Props forwarded to the Dropdown"), type: "Omit<DropdownProps, 'menu' | 'children'>", default: "-" },
            { property: "current", description: "Marks the current page (dark text)", type: "boolean", default: "false" },
            { property: "onClick", description: "Click handler", type: "(e) => void", default: "-" },
          ],
        },
        {
          title: "BreadcrumbSeparator",
          rows: [{ property: "children", description: "Custom separator; falls back to Breadcrumb `separator`", type: "ReactNode", default: "/" }],
        },
      ]}
      related={[{ title: "Dropdown", path: "/components/dropdown" }, { title: "Menu", path: "/components/menu" }]}
    />
  );
}
