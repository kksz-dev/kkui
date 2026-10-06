import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Icon from "./demos/icon";
import iconCode from "./demos/icon.tsx?raw";
import Slide from "./demos/slide";
import slideCode from "./demos/slide.tsx?raw";
import Extra from "./demos/extra";
import extraCode from "./demos/extra.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Position from "./demos/position";
import positionCode from "./demos/position.tsx?raw";
import Card from "./demos/card";
import cardCode from "./demos/card.tsx?raw";
import EditableCard from "./demos/editable-card";
import editableCardCode from "./demos/editable-card.tsx?raw";
import CardTop from "./demos/card-top";
import cardTopCode from "./demos/card-top.tsx?raw";
import CustomAdd from "./demos/custom-add";
import customAddCode from "./demos/custom-add.tsx?raw";
import Centered from "./demos/centered";
import centeredCode from "./demos/centered.tsx?raw";
import Indicator from "./demos/indicator";
import indicatorCode from "./demos/indicator.tsx?raw";
import Animated from "./demos/animated";
import animatedCode from "./demos/animated.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="tabs"
      imports={["Tabs", "TabPane"]}
      whenToUse={tr(
        <>
          <p>
            แท็บสไตล์ enterprise สร้างบน KKUI Tabs primitive ใช้สลับดูเนื้อหาหลายมุมมองในพื้นที่เดียวกัน
          </p>
          <ul>
            <li>Card Tabs: เหมาะกับการจัดการหน้าต่างหรือเอกสารหลายชิ้นที่ปิดได้</li>
            <li>Line Tabs: สไตล์เริ่มต้น เรียบและทันสมัย มีเส้นบอกตำแหน่งเลื่อนตามแท็บที่เลือก</li>
            <li>Editable Tabs: เพิ่มและลบแท็บได้ระหว่างใช้งาน</li>
          </ul>
        </>,
        <>
          <p>
            enterprise-style tabs built on the KKUI Tabs primitive. Tabs make it easy to explore and switch between different views.
          </p>
          <ul>
            <li>Card Tabs: suitable for managing multiple closed windows or documents.</li>
            <li>Line Tabs: default style, clean and modern with an animated sliding indicator line.</li>
            <li>Editable Tabs: support adding and removing tabs dynamically.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("กำหนดแท็บที่เปิดอยู่ตอนแรกและการสลับแท็บพื้นฐาน", "Default active tab and basic switching."), code: basicCode, component: <Basic /> },
        { title: tr("ปิดใช้งาน", "Disabled"), description: tr("ปิดแท็บบางตัวไม่ให้เลือกได้", "Disabled a tab item so that it cannot be activated."), code: disabledCode, component: <Disabled /> },
        { title: tr("ไอคอน", "Icon"), description: tr("แท็บที่มีไอคอนนำหน้าข้อความ", "Tabs with an icon placed in front of the label text."), code: iconCode, component: <Icon /> },
        { title: tr("เลื่อนแท็บ", "Slide"), description: tr("เมื่อมีแท็บจำนวนมาก แถบแท็บจะเลื่อนแนวนอนได้", "Tabs can be scrolled horizontally when there are many items."), code: slideCode, component: <Slide /> },
        { title: tr("เนื้อหาเสริม", "Extra content"), description: tr(<>เพิ่มปุ่มหรือเนื้อหาอื่นในแถบแท็บด้วย <code>tabBarExtraContent</code></>, <>You can add extra actions to the tab bar using <code>tabBarExtraContent</code>.</>), code: extraCode, component: <Extra /> },
        { title: tr("ขนาด", "Size"), description: tr(<>แท็บขนาดใหญ่ ปกติ และเล็ก ผ่าน <code>size="sm" | "md" | "lg"</code></>, <>Large, default and small tab sizes via <code>size="sm" | "md" | "lg"</code>.</>), code: sizeCode, component: <Size /> },
        { title: tr("ตำแหน่ง", "Position"), description: tr(<>ตำแหน่งของแถบแท็บ: <code>top</code>, <code>bottom</code>, <code>left</code> หรือ <code>right</code></>, <>Tab navigation position: <code>top</code>, <code>bottom</code>, <code>left</code> or <code>right</code>.</>), code: positionCode, component: <Position /> },
        { title: tr("แบบการ์ด", "Card type"), description: tr(<>แท็บสไตล์การ์ดด้วย <code>type="card"</code></>, <>Card style tabs with <code>type="card"</code>.</>), code: cardCode, component: <Card /> },
        { title: tr("เพิ่มและปิดแท็บ", "Add & close tab"), description: tr(<>เฉพาะแท็บแบบการ์ดเท่านั้นที่เพิ่มและปิดได้ ผ่าน <code>type="editable-card"</code></>, <>Only card type tabs support add and close via <code>type="editable-card"</code>.</>), code: editableCardCode, component: <EditableCard /> },
        { title: tr("แท็บบนการ์ด", "Card top"), description: tr("แท็บแบบการ์ดที่อยู่ในคอนเทนเนอร์ Card อีกชั้น", "Card tabs inside a container card."), code: cardTopCode, component: <CardTop /> },
        { title: tr("ปุ่มเพิ่มแบบกำหนดเอง", "Customized trigger"), description: tr("ซ่อนปุ่มเพิ่มเริ่มต้น แล้วสั่งเพิ่มแท็บจากปุ่มภายนอกแทน", "Hide default add button and trigger addition from an external button."), code: customAddCode, component: <CustomAdd /> },
        { title: tr("จัดกึ่งกลาง", "Centered"), description: tr(<>จัดแถบแท็บให้อยู่กึ่งกลางด้วย <code>centered</code></>, <>Centered tabs navigation bar with <code>centered</code>.</>), code: centeredCode, component: <Centered /> },
        { title: tr("ปรับเส้นบอกตำแหน่ง", "Custom indicator"), description: tr(<>ปรับขนาดและการจัดวางของเส้นบอกตำแหน่งด้วย <code>indicator</code></>, <>Customize the sliding indicator line size and alignment via <code>indicator</code>.</>), code: indicatorCode, component: <Indicator /> },
        { title: tr("แอนิเมชัน", "Animated"), description: tr(<>เปลี่ยนแท็บแบบลื่นไหลด้วย <code>animated</code></>, <>Smooth transitions between tabs with <code>animated</code>.</>), code: animatedCode, component: <Animated /> },
      ]}
      api={[
        {
          title: "Tabs",
          description: "Tabs container component.",
          rows: [
            { property: "activeKey", description: "Current TabPane's key (controlled)", type: "string", default: "-" },
            { property: "animated", description: "Whether to animate switching", type: "boolean | { inkBar?: boolean, tabPane?: boolean }", default: "true" },
            { property: "centered", description: "Centers tabs header", type: "boolean", default: "false" },
            { property: "defaultActiveKey", description: "Initial active key (uncontrolled)", type: "string", default: "first item key" },
            { property: "destroyOnHidden", description: "Whether destroy inactive TabPane when they are hidden", type: "boolean", default: "false" },
            { property: "hideAdd", description: "Hide the add button in editable-card", type: "boolean", default: "false" },
            { property: "indicator", description: "Indicator width/height and align customization", type: "{ size?: number | ((origin) => number), align?: 'start' | 'center' | 'end' }", default: "-" },
            { property: "items", description: "Configure tab items", type: "TabItem[]", default: "[]" },
            { property: "size", description: "Preset size of tabs", type: "sm | md | lg | small | middle | large", default: "md" },
            { property: "tabBarExtraContent", description: "Extra content in tab bar", type: "ReactNode | { left?: ReactNode, right?: ReactNode }", default: "-" },
            { property: "tabBarGutter", description: "The gap between tabs", type: "number", default: "-" },
            { property: "tabPosition", description: "Position of tabs", type: "top | right | bottom | left", default: "top" },
            { property: "type", description: "Basic style of tabs", type: "line | card | editable-card", default: "line" },
            { property: "onChange", description: "Callback executed when active tab is changed", type: "(activeKey: string) => void", default: "-" },
            { property: "onEdit", description: "Callback executed when tab is added or removed", type: "(targetKey, action: 'add' | 'remove') => void", default: "-" },
            { property: "onTabClick", description: "Callback executed when tab is clicked", type: "(key: string, e: MouseEvent) => void", default: "-" },
          ],
        },
        {
          title: "TabItem",
          description: "Configuration object for each tab in `items`.",
          rows: [
            { property: "children", description: "Tab pane content", type: "ReactNode", default: "-" },
            { property: "closable", description: "Whether tab can be closed in editable-card", type: "boolean", default: "true" },
            { property: "closeIcon", description: "Custom close icon", type: "ReactNode", default: "<X />" },
            { property: "disabled", description: "Disable this tab", type: "boolean", default: "false" },
            { property: "forceRender", description: "Forced render of TabPane content even when hidden", type: "boolean", default: "false" },
            { property: "icon", description: "Tab icon", type: "ReactNode", default: "-" },
            { property: "key", description: "Unique key for the tab pane", type: "string", default: "-" },
            { property: "label", description: "Tab label title", type: "ReactNode", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Segmented", path: "/components/segmented" },
        { title: "Radio", path: "/components/radio" },
      ]}
    />
  );
}
