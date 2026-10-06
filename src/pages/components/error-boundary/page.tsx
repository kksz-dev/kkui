import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import CustomFallbackDemo from "./demos/custom-fallback";
import customFallbackCode from "./demos/custom-fallback.tsx?raw";
import HOCDemo from "./demos/hoc";
import hocCode from "./demos/hoc.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="error-boundary"
      imports={["ErrorBoundary", "withErrorBoundary", "type ErrorBoundaryProps"]}
      whenToUse={tr(
        <p>ครอบส่วนที่พังแล้วไม่ควรลากทั้งหน้าไปด้วย — วิดเจ็ตบนแดชบอร์ด กราฟที่ข้อมูลมาจากภายนอก หรือทั้งเนื้อหาของ route</p>,
        <p>Wrap the parts that should not take the page down with them: dashboard widgets, charts fed by external data, or a route's whole content.</p>,
      )}
      demos={[
        {
          title: tr("จับ error ในส่วนเดียว", "Contain the Failure"),
          description: tr("ส่วนอื่นของหน้ายังทำงาน กดลองใหม่แล้วกลับมาเรนเดอร์ปกติ", "The rest of the page keeps working; retry re-renders the subtree."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("กล่องแจ้งของตัวเอง", "Custom Fallback UI"),
          description: tr("รับ error และ reset เพื่อประกอบหน้าตาเอง", "The fallback receives the error and a reset function."),
          code: customFallbackCode,
          component: <CustomFallbackDemo />,
        },
        {
          title: tr("การใช้งานผ่าน HOC", "Higher-Order Component (withErrorBoundary)"),
          description: tr("ครอบ component ทั้งตัวด้วย withErrorBoundary ได้โดยตรง", "Wrap an entire component declaration cleanly with withErrorBoundary."),
          code: hocCode,
          component: <HOCDemo />,
        },
      ]}
      api={[
        {
          title: "ErrorBoundary",
          rows: [
            { property: "fallback", description: "Replace the panel; a function receives { error, componentStack, reset }", type: "ReactNode | (props: ErrorFallbackProps) => ReactNode", default: "built-in panel" },
            { property: "onError", description: "Report the failure", type: "(error: Error, info: ErrorInfo) => void", default: "-" },
            { property: "onReset", description: "Callback after a successful reset", type: "() => void", default: "-" },
            { property: "resetKeys", description: "Any change here clears the error automatically (e.g. route change)", type: "unknown[]", default: "-" },
            { property: "showDetails", description: "Print the error message and call stack", type: "boolean", default: "DEV only" },
            { property: "title / description / retryText", description: "Labels in the default panel", type: "ReactNode", default: "English" },
          ],
        },
        {
          title: "withErrorBoundary",
          rows: [
            { property: "withErrorBoundary(Component, props?)", description: "Wrap once instead of at every call site", type: "(Component: ComponentType, props?: ErrorBoundaryProps) => ComponentType", default: "-" },
          ],
        },
      ]}
      related={[{ path: "/components/result", title: "Result" }, { path: "/components/empty", title: "Empty" }]}
    />
  );
}
