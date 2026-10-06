import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Top from "./demos/top";
import topCode from "./demos/top.tsx?raw";
import TopSide from "./demos/top-side";
import topSideCode from "./demos/top-side.tsx?raw";
import Sider from "./demos/sider";
import siderCode from "./demos/sider.tsx?raw";
import CustomTrigger from "./demos/custom-trigger";
import customTriggerCode from "./demos/custom-trigger.tsx?raw";
import Responsive from "./demos/responsive";
import responsiveCode from "./demos/responsive.tsx?raw";
import Fixed from "./demos/fixed";
import fixedCode from "./demos/fixed.tsx?raw";
import FixedSider from "./demos/fixed-sider";
import fixedSiderCode from "./demos/fixed-sider.tsx?raw";
import LightSider from "./demos/light-sider";
import lightSiderCode from "./demos/light-sider.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="layout"
      imports={["Layout", "LayoutHeader", "LayoutSider", "LayoutContent", "LayoutFooter"]}
      whenToUse={
        <>
          <p>
            Layout is the frame of a page: a <code>Layout</code> container with an optional <code>LayoutHeader</code>, <code>LayoutSider</code>,
            <code>LayoutContent</code> and <code>LayoutFooter</code>. Nest layouts to combine top navigation with a side menu.
          </p>
          <ul>
            <li><code>Layout</code> stacks children vertically; when a <code>LayoutSider</code> is a direct child it automatically switches to a row.</li>
            <li><code>LayoutSider</code> can be collapsible, react to a breakpoint, use a light or dark theme, and hide its bottom trigger with <code>trigger={"{null}"}</code> (the zero-width trigger stays).</li>
            <li>The parts are also attached as statics: <code>Layout.Header</code>, <code>Layout.Sider</code>, <code>Layout.Content</code>, <code>Layout.Footer</code>.</li>
            <li>Sider / Header background follows KKUI's <code>#001529</code>; override with <code>--kk-layout-sider-bg</code>.</li>
            <li>Only nest layouts, do not put arbitrary elements between <code>Layout</code> and its parts.</li>
          </ul>
        </>
      }
      demos={[
        { title: "Basic Structure", description: <>Classic page layouts built from Header, Sider, Content and Footer.</>, code: basicCode, component: <Basic />, full: true },
        { title: "Header-Content-Footer", description: <>The most basic top navigation layout.</>, code: topCode, component: <Top />, full: true, background: "bg-bg-layout" },
        { title: "Header Sider 2", description: <>Top navigation combined with a side menu inside the content.</>, code: topSideCode, component: <TopSide />, full: true, background: "bg-bg-layout" },
        { title: "Sider", description: <>Collapsible sider with the default bottom trigger — the classic admin layout.</>, code: siderCode, component: <Sider />, full: true, background: "bg-bg-layout" },
        { title: "Custom trigger", description: <>Pass <code>trigger={"{null}"}</code> to hide the built-in trigger and control <code>collapsed</code> yourself.</>, code: customTriggerCode, component: <CustomTrigger />, full: true, background: "bg-bg-layout" },
        { title: "Responsive", description: <>Sider collapses below <code>breakpoint</code>; with <code>collapsedWidth={"{0}"}</code> a zero-width trigger appears (resize the window).</>, code: responsiveCode, component: <Responsive />, full: true, background: "bg-bg-layout" },
        { title: "Fixed Header", description: <>Make the header sticky and let the content scroll under it.</>, code: fixedCode, component: <Fixed />, full: true, background: "bg-bg-layout" },
        { title: "Fixed Sider", description: <>Sticky sider while the content scrolls.</>, code: fixedSiderCode, component: <FixedSider />, full: true, background: "bg-bg-layout" },
        { title: "Light Sider", description: <><code>theme="light"</code> and <code>defaultCollapsed</code>.</>, code: lightSiderCode, component: <LightSider />, full: true, background: "bg-bg-layout" },
      ]}
      api={[
        {
          title: "Layout",
          description: "Container. Also used for LayoutHeader / LayoutContent / LayoutFooter which accept className and native props.",
          rows: [
            { property: "className", description: "Container className", type: "string", default: "-" },
            { property: "hasSider", description: "Whether contains a Sider in children; auto-detected, set it to avoid layout flicker on SSR", type: "boolean", default: "-" },
            { property: "style", description: "Inline style", type: "CSSProperties", default: "-" },
            { property: "Layout.Header / Sider / Content / Footer", description: tr("สแตติกที่ชี้ไปยัง LayoutHeader / LayoutSider / LayoutContent / LayoutFooter (ยังนำเข้าแบบ flat ได้เหมือนเดิม)", "Statics pointing at LayoutHeader / LayoutSider / LayoutContent / LayoutFooter (the flat imports still work)"), type: "ComponentType", default: "-" },
          ],
        },
        {
          title: "LayoutSider",
          rows: [
            { property: "breakpoint", description: "Breakpoint of the responsive layout", type: "xs | sm | md | lg | xl | xxl", default: "-" },
            { property: "className", description: "Container className", type: "string", default: "-" },
            { property: "collapsed", description: "To set the current status", type: "boolean", default: "-" },
            { property: "collapsedWidth", description: tr("ความกว้างตอนยุบ ถ้าเป็น 0 จะมีปุ่มพิเศษ (zero-width trigger) โผล่ข้างนอก แม้ตั้ง trigger={null} ก็ยังอยู่", "Width of the collapsed sidebar; 0 shows the special zero-width trigger, which stays even with trigger={null}"), type: "number | string", default: "80" },
            { property: "collapsible", description: "Whether can be collapsed", type: "boolean", default: "false" },
            { property: "defaultCollapsed", description: "To set the initial status", type: "boolean", default: "false" },
            { property: "reverseArrow", description: "Reverse direction of arrow, for a sider that expands from the right", type: "boolean", default: "false" },
            { property: "style", description: "Inline style", type: "CSSProperties", default: "-" },
            { property: "theme", description: "Color theme of the sidebar", type: "light | dark", default: "dark" },
            { property: "trigger", description: tr("ตัวเปิด/ปิดที่กำหนดเอง; null = ซ่อนปุ่มด้านล่างเท่านั้น ปุ่ม zero-width ยังทำงานอยู่", "Customized trigger; null hides only the bottom trigger — the zero-width trigger still renders"), type: "ReactNode", default: "-" },
            { property: "width", description: "Width of the sidebar", type: "number | string", default: "200" },
            { property: "zeroWidthTriggerStyle", description: "To customize the styles of the special trigger that appears when collapsedWidth is 0", type: "CSSProperties", default: "-" },
            { property: "onBreakpoint", description: "The callback function, executed when breakpoints changed", type: "(broken: boolean) => void", default: "-" },
            { property: "onCollapse", description: "The callback function, executed by clicking the trigger or activating the responsive layout", type: "(collapsed, type: clickTrigger | responsive) => void", default: "-" },
          ],
        },
      ]}
      extra={
        <>
          <h2>Breakpoint width</h2>
          <pre className="rounded-md bg-fill-quaternary p-3 font-mono text-xs text-text-secondary">{`xs: 480px   sm: 576px   md: 768px\nlg: 992px   xl: 1200px  xxl: 1600px`}</pre>
          <p>The Sider collapses when the viewport is narrower than the chosen breakpoint (max-width: breakpoint − 0.02px).</p>
        </>
      }
      related={[{ title: "Grid", path: "/components/grid" }, { title: "Menu", path: "/components/menu" }, { title: "Splitter", path: "/components/splitter" }]}
    />
  );
}
