import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Commands from "./demos/commands";
import commandsCode from "./demos/commands.tsx?raw";
import CollapsibleDemo from "./demos/collapsible";
import collapsibleCode from "./demos/collapsible.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="ribbon"
      imports={['Ribbon', 'type RibbonTab', 'type RibbonGroup', 'type RibbonItem', 'type RibbonProps']}
      defaultDemoSize="full"
      whenToUse={tr(
        <p>ใช้จัดชุดคำสั่งจำนวนมากเป็นแถบแท็บ แบบโปรแกรมเอกสารระดับองค์กร</p>,
        <p>Use to organize rich feature sets into tabbed command toolbars in enterprise document editors and software.</p>,
      )}
      demos={[
        {
          title: tr("แถบคำสั่งริบบอน", "Command Ribbon Toolbar"),
          description: tr(<>แถบเครื่องมือแบบแท็บ จัดคำสั่งเป็นหมวด แต่ละกลุ่มรับ node ใดๆ ก็ได้ เช่น <code>Button</code></>, <>Tabbed toolbar grouping commands into categorized sections; a group accepts any node, such as <code>Button</code>.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("คำสั่งสำเร็จรูป", "Commands"),
          description: tr(<>ส่ง <code>RibbonItem</code> แทน node: <code>icon</code>, <code>label</code>, <code>onClick</code>, <code>active</code>, <code>disabled</code> และ <code>size="lg"</code> สำหรับคำสั่งหลัก</>, <>Pass <code>RibbonItem</code> objects instead of nodes: <code>icon</code>, <code>label</code>, <code>onClick</code>, <code>active</code>, <code>disabled</code>, and <code>size="lg"</code> for a primary command.</>),
          code: commandsCode,
          component: <Commands />,
        },
        {
          title: tr("พับแถบ ปุ่มลัด และแท็บตามบริบท", "Collapse, Quick Access and Contextual Tabs"),
          description: tr("พับแถบคำสั่ง ปักปุ่มลัดไว้บนหัว และโชว์แท็บตามบริบทเฉพาะตอนที่เลือกวัตถุอยู่", "Fold the command bar, pin commands to the header, and show a contextual tab only while something is selected."),
          code: collapsibleCode,
          component: <CollapsibleDemo />,
        },
        {
          title: tr("ควบคุมจากภายนอก", "Controlled"),
          description: tr(<>คุมแท็บด้วย <code>activeKey</code> / <code>onChange</code> และสถานะพับด้วย <code>collapsed</code> / <code>onCollapsedChange</code></>, <>Drive the tab with <code>activeKey</code> / <code>onChange</code> and the folded state with <code>collapsed</code> / <code>onCollapsedChange</code>.</>),
          code: controlledCode,
          component: <Controlled />,
        },
      ]}
      api={[
        {
          title: "Ribbon",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLDivElement> (ยกเว้น `onChange`)", "Extends React.HTMLAttributes<HTMLDivElement> (except `onChange`)."),
          rows: [
            { property: "tabs", description: tr("รายการแท็บ แต่ละแท็บมีกลุ่มคำสั่ง", "Tab definitions, each holding command groups"), type: "RibbonTab[]", default: "-" },
            { property: "activeKey", description: tr("key ของแท็บที่เลือกอยู่ (controlled)", "Key of the selected tab (controlled)"), type: "string", default: "-" },
            { property: "defaultActiveKey", description: tr("key ของแท็บเริ่มต้น (uncontrolled)", "Initially selected tab key (uncontrolled)"), type: "string", default: tr("key ของแท็บแรก", "first tab key") },
            { property: "onChange", description: tr("เรียกเมื่อเปลี่ยนแท็บ", "Called when the selected tab changes"), type: "(key: string) => void", default: "-" },
            { property: "quickAccess", description: tr("คำสั่งปักไว้บนหัว ด้านซ้ายของแท็บ", "Commands pinned to the header, left of the tabs"), type: "ReactNode", default: "-" },
            { property: "collapsible", description: tr("พับแถบคำสั่งได้ ด้วยปุ่มลูกศรหรือคลิกแท็บที่เลือกอยู่ซ้ำ", "Allow the command bar to fold away, via the chevron or by clicking the active tab again"), type: "boolean", default: "false" },
            { property: "collapsed", description: tr("สถานะพับ (controlled)", "Folded state (controlled)"), type: "boolean", default: "-" },
            { property: "defaultCollapsed", description: tr("สถานะพับเริ่มต้น (uncontrolled)", "Initial folded state (uncontrolled)"), type: "boolean", default: "false" },
            { property: "onCollapsedChange", description: tr("เรียกเมื่อสถานะพับเปลี่ยน", "Called when the folded state changes"), type: "(collapsed: boolean) => void", default: "-" },
            { property: "className", description: tr("คลาสเพิ่มเติมของ root", "Extra class on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "RibbonTab",
          rows: [
            { property: "key", description: tr("ตัวระบุแท็บ ต้องไม่ซ้ำ", "Unique tab key"), type: "string", default: "-" },
            { property: "label", description: tr("ข้อความบนแท็บ", "Tab label"), type: "ReactNode", default: "-" },
            { property: "groups", description: tr("กลุ่มคำสั่งที่แสดงในแผงของแท็บ", "Command groups shown in the tab panel"), type: "RibbonGroup[]", default: "-" },
            { property: "contextual", description: tr("แท็บตามบริบท ย้อมสี primary — ใส่ใน tabs เฉพาะตอนที่ feature ถูกเลือก", "Contextual tab, tinted primary — include it in tabs only while its feature is selected"), type: "boolean", default: "false" },
            { property: "contextualLabel", description: tr("หัวข้อเล็กเหนือแท็บตามบริบท", "Small heading printed above a contextual tab"), type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "RibbonGroup",
          rows: [
            { property: "key", description: tr("ตัวระบุกลุ่ม ต้องไม่ซ้ำ", "Unique group key"), type: "string", default: "-" },
            { property: "title", description: tr("ชื่อกลุ่ม แสดงใต้คำสั่ง", "Group caption shown under the commands"), type: "ReactNode", default: "-" },
            { property: "items", description: tr("คำสั่งสำเร็จรูป (RibbonItem) หรือ node ใดๆ สำหรับคอนโทรลเฉพาะ", "Ready-made commands (RibbonItem) or any node for a custom control"), type: "(RibbonItem | ReactNode)[]", default: "-" },
          ],
        },
        {
          title: "RibbonItem",
          rows: [
            { property: "key", description: tr("ตัวระบุคำสั่ง ต้องไม่ซ้ำ", "Unique item key"), type: "string", default: "-" },
            { property: "icon", description: tr("ไอคอน", "Icon"), type: "ReactNode", default: "-" },
            { property: "label", description: tr("ข้อความคำสั่ง", "Command label"), type: "ReactNode", default: "-" },
            { property: "onClick", description: tr("เรียกเมื่อคลิก", "Click handler"), type: "() => void", default: "-" },
            { property: "disabled", description: tr("ปิดใช้งานคำสั่ง", "Disable the command"), type: "boolean", default: "false" },
            { property: "active", description: tr("สถานะเปิดอยู่ (aria-pressed) ไฮไลต์สี primary", "Toggled state (aria-pressed), highlighted in primary"), type: "boolean", default: "false" },
            { property: "size", description: tr("`lg` วางไอคอนใหญ่ซ้อนข้อความ แบบคำสั่งหลักของริบบอน", "`lg` stacks a large icon over the label, like a primary ribbon command"), type: "sm | lg", default: "sm" },
          ],
        },
      ]}
      related={[
        { title: "Tabs", path: "/components/tabs" },
        { title: "AppBar", path: "/components/app-bar" },
      ]}
    />
  );
}
