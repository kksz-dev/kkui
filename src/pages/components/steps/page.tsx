import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Mini from "./demos/mini";
import miniCode from "./demos/mini.tsx?raw";
import WithIcon from "./demos/with-icon";
import withIconCode from "./demos/with-icon.tsx?raw";
import SwitchStep from "./demos/switch-step";
import switchStepCode from "./demos/switch-step.tsx?raw";
import Vertical from "./demos/vertical";
import verticalCode from "./demos/vertical.tsx?raw";
import VerticalMini from "./demos/vertical-mini";
import verticalMiniCode from "./demos/vertical-mini.tsx?raw";
import ErrorStatus from "./demos/error-status";
import errorStatusCode from "./demos/error-status.tsx?raw";
import DotStyle from "./demos/dot-style";
import dotStyleCode from "./demos/dot-style.tsx?raw";
import DotStyleVertical from "./demos/dot-style-vertical";
import dotStyleVerticalCode from "./demos/dot-style-vertical.tsx?raw";
import Clickable from "./demos/clickable";
import clickableCode from "./demos/clickable.tsx?raw";
import Navigation from "./demos/navigation";
import navigationCode from "./demos/navigation.tsx?raw";
import Progress from "./demos/progress";
import progressCode from "./demos/progress.tsx?raw";
import LabelPlacement from "./demos/label-placement";
import labelPlacementCode from "./demos/label-placement.tsx?raw";
import Inline from "./demos/inline";
import inlineCode from "./demos/inline.tsx?raw";
import CustomIcons from "./demos/custom-icons";
import customIconsCode from "./demos/custom-icons.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="steps"
      imports={["Steps", "Step"]}
      whenToUse={
        <>
          <p>
            Steps is a navigation bar that guides users through the steps of a task sequence; when the task is complicated or has a certain sequence in the series of subtasks, we can decompose it into several steps to make it easier to operate.
          </p>
          <ul>
            <li>When a given task is complicated or has sequential subtasks.</li>
            <li>When you need to inform the user about where they are in a process.</li>
            <li>When you want users to jump between steps in an editable wizard.</li>
          </ul>
        </>
      }
      demos={[
        { title: "Basic", description: "The most basic step bar.", code: basicCode, component: <Basic /> },
        { title: "Mini version", description: <>By setting <code>size="small"</code>, you can use the mini version.</>, code: miniCode, component: <Mini /> },
        { title: "With icon", description: "You can use custom icons by setting the icon property.", code: withIconCode, component: <WithIcon /> },
        { title: "Switch Step", description: "A classic multi-step form wizard with previous and next controls.", code: switchStepCode, component: <SwitchStep /> },
        { title: "Vertical", description: "A vertical step bar, ideal for sidebars or timeline-like processes.", code: verticalCode, component: <Vertical /> },
        { title: "Vertical mini version", description: "A simple vertical mini step bar.", code: verticalMiniCode, component: <VerticalMini /> },
        { title: "Error status", description: <>By using <code>status="error"</code>, you can show the error status for the step.</>, code: errorStatusCode, component: <ErrorStatus /> },
        { title: "Dot Style", description: <>Use <code>progressDot</code> to style steps with customized dots.</>, code: dotStyleCode, component: <DotStyle /> },
        { title: "Dot Style Vertical", description: "Vertical steps with dot style.", code: dotStyleVerticalCode, component: <DotStyleVertical /> },
        { title: "Clickable", description: <>Set <code>onChange</code> to make steps interactive and clickable.</>, code: clickableCode, component: <Clickable /> },
        { title: "Navigation", description: <>Navigation steps with <code>type="navigation"</code>.</>, code: navigationCode, component: <Navigation /> },
        { title: "Step with progress", description: tr(<><code>percent</code> วาดวงแหวนความคืบหน้ารอบไอคอนของสเต็ปปัจจุบัน ทั้งวงกลมเลขลำดับ ไอคอนที่กำหนดเอง และโหมด <code>progressDot</code></>, <><code>percent</code> draws a progress ring around the current step icon — the numbered circle, a custom <code>icon</code> and <code>progressDot</code> mode alike.</>), code: progressCode, component: <Progress /> },
        { title: "Label Placement", description: <>Set <code>labelPlacement="vertical"</code> to place titles and descriptions below icons.</>, code: labelPlacementCode, component: <LabelPlacement /> },
        { title: "Inline Steps", description: tr(<>จุดแบบกะทัดรัดด้วย <code>type="inline"</code> และ <code>description</code> จะแสดงต่อท้ายชื่อสเต็ป</>, <>Compact inline dots with <code>type="inline"</code>; a step <code>description</code> is shown next to its title.</>), code: inlineCode, component: <Inline /> },
        { title: "Customized Dot Style", description: <>You can customize the dot rendering function via <code>progressDot</code>.</>, code: customIconsCode, component: <CustomIcons /> },
      ]}
      api={[
        {
          title: "Steps",
          description: "Main steps component wrapper.",
          rows: [
            { property: "current", description: "To set the current step, counting from 0 (or initial)", type: "number", default: "0" },
            { property: "direction", description: "To specify the direction of the step bar", type: "horizontal | vertical", default: "horizontal" },
            { property: "initial", description: "Set the initial step counting base", type: "number", default: "0" },
            { property: "items", description: "Step items configuration array", type: "StepItem[]", default: "[]" },
            { property: "labelPlacement", description: "Placement of label", type: "horizontal | vertical", default: "horizontal" },
            { property: "percent", description: tr("เปอร์เซ็นต์ของวงแหวนรอบไอคอนสเต็ปปัจจุบัน ใช้ได้ทั้งวงกลมมาตรฐาน ไอคอนกำหนดเอง และ progressDot", "Progress ring percentage on the current step — works with the default circle, a custom icon and progressDot"), type: "number", default: "-" },
            { property: "progressDot", description: "Steps with customized dots", type: "boolean | (dot, { index, status, title, description }) => ReactNode", default: "false" },
            { property: "responsive", description: "Change to vertical direction when screen width is under 532px", type: "boolean", default: "true" },
            { property: "size", description: "Size of step bar", type: "default | small", default: "default" },
            { property: "status", description: "To specify the status of the current step", type: "wait | process | finish | error", default: "process" },
            { property: "type", description: tr("ชนิดของ Steps (inline แสดงทั้ง title และ description)", "Type of steps (inline renders both title and description)"), type: "default | navigation | inline", default: "default" },
            { property: "onChange", description: "Triggered when step is clicked", type: "(current: number) => void", default: "-" },
          ],
        },
        {
          title: "StepItem",
          description: "Configuration object for each step item in `items`.",
          rows: [
            { property: "description", description: tr("คำอธิบายสั้นๆ ของสเต็ป แสดงในทุก type รวมถึง inline", "A short description of the step, rendered in every type including inline"), type: "ReactNode", default: "-" },
            { property: "disabled", description: "Disable click event for this step", type: "boolean", default: "false" },
            { property: "icon", description: "Custom icon for the step", type: "ReactNode", default: "-" },
            { property: "status", description: "Explicit status of this step", type: "wait | process | finish | error", default: "-" },
            { property: "subTitle", description: "Subtitle of the step", type: "ReactNode", default: "-" },
            { property: "title", description: "Title of the step", type: "ReactNode", default: "-" },
            { property: "onClick", description: "Custom click handler", type: "MouseEventHandler", default: "-" },
            { property: "className", description: "Custom class name", type: "string", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Breadcrumb", path: "/components/breadcrumb" },
        { title: "Pagination", path: "/components/pagination" },
        { title: "Timeline", path: "/components/timeline" },
      ]}
    />
  );
}
