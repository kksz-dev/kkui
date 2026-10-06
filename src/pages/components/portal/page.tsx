import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Container from "./demos/container";
import containerCode from "./demos/container.tsx?raw";
import Selector from "./demos/selector";
import selectorCode from "./demos/selector.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import OnMount from "./demos/on-mount";
import onMountCode from "./demos/on-mount.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="portal"
      imports={["Portal"]}
      whenToUse={tr(
        <ul>
          <li>ต้องการให้ popup ทะลุ <code>overflow: hidden</code> หรือ stacking context ของ parent</li>
          <li>สร้างคอมโพเนนต์ลอยของตัวเอง — Modal, Drawer, Dropdown, DatePicker ในไลบรารีนี้ใช้ Portal เป็นฐานทั้งหมด</li>
          <li>อยากบังคับให้ popup ไปอยู่ใน container ที่ scroll เอง แทนที่จะเป็น <code>document.body</code></li>
        </ul>,
        <ul>
          <li>A popup must escape a parent's <code>overflow: hidden</code> or stacking context.</li>
          <li>You are building your own floating component — Modal, Drawer, Dropdown and DatePicker all sit on Portal.</li>
          <li>You need the popup inside a scrolling container instead of <code>document.body</code>.</li>
        </ul>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr(
            <>ไม่ระบุ <code>container</code> จะ render ไปที่ <code>document.body</code></>,
            <>Without a <code>container</code> the children render into <code>document.body</code>.</>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ระบุ container", "Custom container"),
          description: tr(
            <>ส่ง element ตรงๆ หรือฟังก์ชันที่คืน element (เหมาะกับ ref ที่ยังเป็น null ตอน render แรก)</>,
            <>Pass an element, or a getter that returns one — handy for refs that are still null on first render.</>,
          ),
          code: containerCode,
          component: <Container />,
        },
        {
          title: tr("ใช้ CSS selector", "CSS selector"),
          description: tr(
            <><code>container</code> รับสตริง selector ได้ด้วย</>,
            <><code>container</code> also accepts a selector string.</>,
          ),
          code: selectorCode,
          component: <Selector />,
        },
        {
          title: tr("ปิดการ portal", "Disable the portal"),
          description: tr(
            <><code>disabled</code> จะ render ตรงตำแหน่งเดิมโดยไม่ย้าย DOM — ใช้ตอนเขียนเทสต์หรือเมื่อ popup ต้องอยู่ในโฟลว์</>,
            <><code>disabled</code> renders in place without moving the DOM — useful in tests, or when the popup must stay in flow.</>,
          ),
          code: disabledCode,
          component: <Disabled />,
        },
        {
          title: tr("รู้ว่าไป mount ที่ไหน", "Know where it mounted"),
          description: tr(
            <><code>onMount</code> ให้ node ปลายทางกลับมา ใช้วัดตำแหน่งหรือผูก listener ต่อได้</>,
            <><code>onMount</code> hands back the target node so you can measure it or attach listeners.</>,
          ),
          code: onMountCode,
          component: <OnMount />,
        },
      ]}
      api={[
        {
          title: "Portal",
          rows: [
            {
              property: "children",
              description: tr("เนื้อหาที่จะย้ายไป render", "Content to render into the container"),
              type: "ReactNode",
              default: "-",
            },
            {
              property: "container",
              description: tr(
                "ปลายทาง — element, CSS selector หรือฟังก์ชันที่คืน element",
                "Target — an element, a CSS selector, or a getter returning one",
              ),
              type: "HTMLElement | string | (() => HTMLElement | null) | null",
              default: "document.body",
            },
            {
              property: "disabled",
              description: tr("ปิด portal แล้ว render ตรงตำแหน่งเดิม", "Skip the portal and render in place"),
              type: "boolean",
              default: "false",
            },
            {
              property: "forceRender",
              description: tr(
                "หา container ตั้งแต่ render แรกแทนที่จะรอ effect",
                "Resolve the container on first render instead of after the effect",
              ),
              type: "boolean",
              default: "false",
            },
            {
              property: "onMount",
              description: tr("เรียกเมื่อ portal เกาะ container สำเร็จ", "Fired once the portal attaches to its container"),
              type: "(container: HTMLElement) => void",
              default: "-",
            },
          ],
        },
      ]}
      related={[
        { title: "Modal", path: "/components/modal" },
        { title: "Drawer", path: "/components/drawer" },
        { title: "ConfigProvider", path: "/components/config-provider" },
      ]}
    />
  );
}
