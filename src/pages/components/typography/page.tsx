import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Title from "./demos/title";
import titleCode from "./demos/title.tsx?raw";
import Text from "./demos/text";
import textCode from "./demos/text.tsx?raw";
import Paragraph from "./demos/paragraph";
import paragraphCode from "./demos/paragraph.tsx?raw";
import Interactive from "./demos/interactive";
import interactiveCode from "./demos/interactive.tsx?raw";
import Ellipsis from "./demos/ellipsis";
import ellipsisCode from "./demos/ellipsis.tsx?raw";
import EllipsisRows from "./demos/ellipsis-rows";
import ellipsisRowsCode from "./demos/ellipsis-rows.tsx?raw";
import EllipsisMiddle from "./demos/ellipsis-middle";
import ellipsisMiddleCode from "./demos/ellipsis-middle.tsx?raw";

const baseRows = [
  { property: "type", description: "Content type", type: "secondary | success | warning | danger", default: "-" },
  { property: "disabled", description: "Disabled content", type: "boolean", default: "false" },
  { property: "mark", description: "Marked style", type: "boolean", default: "false" },
  { property: "code", description: "Code style", type: "boolean", default: "false" },
  { property: "keyboard", description: "Keyboard style", type: "boolean", default: "false" },
  { property: "underline", description: "Underlined style", type: "boolean", default: "false" },
  { property: "delete", description: "Deleted line style", type: "boolean", default: "false" },
  { property: "strong", description: "Bold style", type: "boolean", default: "false" },
  { property: "italic", description: "Italic style", type: "boolean", default: "false" },
  { property: "ellipsis", description: "Display ellipsis when text overflows; see EllipsisConfig", type: "boolean | EllipsisConfig", default: "false" },
  { property: "copyable", description: "Whether to be copyable; see CopyConfig", type: "boolean | CopyConfig", default: "false" },
  { property: "editable", description: "If editable; see EditConfig", type: "boolean | EditConfig", default: "false" },
  { property: "onClick", description: "Click handler", type: "MouseEventHandler", default: "-" },
];

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="typography"
      imports={["Typography", "TypographyTitle", "TypographyText", "TypographyParagraph", "TypographyLink"]}
      whenToUse={
        <>
          <ul>
            <li>When you need to display a title or paragraph contents in articles or pages.</li>
            <li>When you need copyable, editable or ellipsis text with a consistent look.</li>
          </ul>
          <p className="mt-2">
            Sub-components are exported flat (<code>TypographyTitle</code>, <code>TypographyText</code>, ...) and also
            attached as statics: <code>Typography.Title</code>, <code>Typography.Text</code>, <code>Typography.Paragraph</code>,{" "}
            <code>Typography.Link</code>.
          </p>
        </>
      }
      demos={[
        { title: "Basic", description: <>Display the document sample with <code>Typography</code> as the article wrapper.</>, code: basicCode, component: <Basic /> },
        { title: "Title Component", description: <>Display title in 5 different levels via <code>level</code>.</>, code: titleCode, component: <Title /> },
        { title: "Text and Link", description: <>Provides multiple types of text and links.</>, code: textCode, component: <Text /> },
        { title: "Paragraph", description: <>Block-level text that keeps a bottom margin between consecutive paragraphs.</>, code: paragraphCode, component: <Paragraph /> },
        { title: "Interactive", description: <>Provide additional interactive capacity of editable and copyable. Press Enter to save, Esc to cancel.</>, code: interactiveCode, component: <Interactive /> },
        { title: "Ellipsis", description: <>Multiple line ellipsis support. Set <code>rows</code>, <code>expandable</code> (or <code>"collapsible"</code>) and <code>tooltip</code>.</>, code: ellipsisCode, component: <Ellipsis /> },
        { title: "Ellipsis Middle", description: tr(<><code>suffix</code> เก็บท้ายข้อความไว้ให้เห็นเสมอ แล้วตัดส่วนหน้าแทน จึงได้ ellipsis กลางข้อความ</>, <><code>suffix</code> keeps the tail of the text visible and ellipsizes what comes before it, giving a middle ellipsis.</>), code: ellipsisMiddleCode, component: <EllipsisMiddle /> },
        { title: "Controlled Rows", description: <>Combine <code>rows</code> with a slider; the "more" symbol only appears while the text is actually clamped.</>, code: ellipsisRowsCode, component: <EllipsisRows /> },
      ]}
      api={[
        {
          title: "Typography",
          description: "Article wrapper that sets base font size, line-height and color.",
          rows: [{ property: "component", description: "Root element", type: "article | div | section", default: "article" }],
        },
        {
          title: "Typography.Text",
          rows: baseRows,
        },
        {
          title: "Typography.Title",
          rows: [{ property: "level", description: "Set content importance. Match with h1, h2, h3, h4, h5", type: "1 | 2 | 3 | 4 | 5", default: "1" }, ...baseRows],
        },
        {
          title: "Typography.Paragraph",
          rows: baseRows,
        },
        {
          title: "Typography.Link",
          rows: [
            { property: "href", description: "Link target", type: "string", default: "-" },
            { property: "target", description: "Anchor target; `_blank` adds `rel=noopener noreferrer`", type: "string", default: "-" },
            ...baseRows,
          ],
        },
        {
          title: "EllipsisConfig",
          rows: [
            { property: "rows", description: "Max rows of content (1 = single-line truncate)", type: "number", default: "1" },
            { property: "expandable", description: "Whether to be expandable; `collapsible` also allows collapsing", type: "boolean | 'collapsible'", default: "false" },
            { property: "symbol", description: "Custom expand/collapse symbol", type: "ReactNode | (expanded) => ReactNode", default: "more / Collapse" },
            { property: "expanded", description: "Controlled expanded state", type: "boolean", default: "-" },
            { property: "defaultExpanded", description: "Initial expanded state", type: "boolean", default: "false" },
            { property: "onExpand", description: "Called when the symbol is clicked", type: "(event, { expanded }) => void", default: "-" },
            { property: "onEllipsis", description: "Called when the clamped state changes", type: "(ellipsis: boolean) => void", default: "-" },
            { property: "tooltip", description: "Show full text as tooltip while clamped", type: "boolean | string", default: "-" },
            { property: "suffix", description: tr("โหนดที่อยู่นอกส่วนที่ถูกตัด จึงมองเห็นเสมอ (ใช้ทำ ellipsis กลางข้อความ)", "Node kept outside the ellipsized text so it always stays visible (use it for a middle ellipsis)"), type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "CopyConfig",
          rows: [
            { property: "text", description: "The text to copy (defaults to string children)", type: "string | (() => string | Promise<string>)", default: "-" },
            { property: "onCopy", description: "Called when copied", type: "(event) => void", default: "-" },
            { property: "icon", description: "Custom copy icon: [copyIcon, copiedIcon]", type: "ReactNode | [ReactNode, ReactNode]", default: "-" },
            { property: "tooltips", description: "Custom tooltip text: [copyText, copiedText]; `false` hides them", type: "boolean | [ReactNode, ReactNode]", default: "[Copy, Copied]" },
            { property: "format", description: tr("ชนิด MIME ที่เขียนลงคลิปบอร์ด; text/html จะเขียนคู่กับ text/plain ให้ด้วย", "Clipboard MIME type; text/html also writes a text/plain flavour"), type: "text/plain | text/html", default: "text/plain" },
            { property: "tabIndex", description: "tabIndex of the copy button", type: "number", default: "0" },
          ],
        },
        {
          title: "EditConfig",
          rows: [
            { property: "editing", description: "Whether to be editable (controlled)", type: "boolean", default: "false" },
            { property: "icon", description: "Custom editable icon", type: "ReactNode", default: "<Pencil />" },
            { property: "tooltip", description: "Custom tooltip text; `false` hides it", type: "boolean | ReactNode", default: "Edit" },
            { property: "text", description: "Edit text; defaults to string children", type: "string", default: "-" },
            { property: "maxLength", description: "maxLength of the textarea", type: "number", default: "-" },
            { property: "autoSize", description: "Textarea auto height", type: "boolean | { minRows, maxRows }", default: "true" },
            { property: "triggerType", description: "Which interaction opens the editor", type: "('icon' | 'text')[]", default: "['icon']" },
            { property: "enterIcon", description: "Custom enter icon in the edit field; `null` hides it", type: "ReactNode", default: "<CornerDownLeft />" },
            { property: "onStart", description: "Called when enter editable status", type: "() => void", default: "-" },
            { property: "onChange", description: "Called when the input value changes and is saved", type: "(value: string) => void", default: "-" },
            { property: "onCancel", description: "Called when Esc is pressed", type: "() => void", default: "-" },
            { property: "onEnd", description: "Called when Enter is pressed / blur saves", type: "() => void", default: "-" },
          ],
        },
      ]}
      extra={
        <>
          <h2>FAQ</h2>
          <h3>How does the ellipsis expand button appear?</h3>
          <p>
            The content is measured with a <code>ResizeObserver</code>; the "more" symbol only renders while the text is
            actually clamped, so nothing shows when the container is wide enough.
          </p>
        </>
      }
      related={[{ title: "Divider", path: "/components/divider" }, { title: "Tooltip", path: "/components/tooltip" }]}
    />
  );
}
