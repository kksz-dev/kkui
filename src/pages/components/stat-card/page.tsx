import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import FormattingDemo from "./demos/formatting";
import formattingCode from "./demos/formatting.tsx?raw";
import LoadingDemo from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="stat-card"
      defaultDemoSize="full"
      imports={['StatCard', 'type StatCardProps']}
      whenToUse={tr(
        <p>ใช้เน้นตัวชี้วัดสำคัญ (KPI) และสรุปสถิติบนแดชบอร์ด</p>,
        <p>Use to highlight key performance indicators (KPIs), metrics, and analytics summary in dashboard views.</p>,
      )}
      demos={[
        {
          title: tr("การ์ดตัวชี้วัด", "Analytics StatCards"),
          description: tr("การ์ดตัวเลขพร้อมอนิเมชันนับขึ้นและกราฟเส้นย่อ", "Metric cards with animated count-up numbers and sparklines."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ทศนิยมและตัวจัดรูปแบบ", "Precision and Formatter"),
          description: tr("กำหนดทศนิยม ใส่ formatter เอง และสตริงตัวเลขก็ยังนับขึ้นได้", "Decimal places, a custom formatter, and a numeric string that still counts up."),
          code: formattingCode,
          component: <FormattingDemo />,
        },
        {
          title: tr("กำลังโหลด", "Loading"),
          description: tr("แสดงตัวแทนที่บรรทัดตัวเลขระหว่างรอข้อมูล", "A placeholder holds the value line while the metric is being fetched."),
          code: loadingCode,
          component: <LoadingDemo />,
        },
      ]}
      api={[
        {
          title: "StatCard",
          rows: [
            { property: "title", description: "Label heading of the metric", type: "ReactNode", default: "-" },
            { property: "value", description: "Main number or formatted value string", type: "number | string", default: "-" },
            { property: "prefix", description: "Value prefix (e.g. '$')", type: "ReactNode", default: "-" },
            { property: "suffix", description: "Value suffix (e.g. '%')", type: "ReactNode", default: "-" },
            { property: "trend", description: "Trend indicator object (direction, value, label)", type: "object", default: "-" },
            { property: "sparklineData", description: "Array of numeric values for mini line chart", type: "number[]", default: "-" },
            { property: "animate", description: "Enable count-up animation on load", type: "boolean", default: "true" },
            { property: "loading", description: "Show a placeholder instead of the value", type: "boolean", default: "false" },
            { property: "precision", description: "Decimal places kept while counting and formatting", type: "number", default: "-" },
            { property: "formatter", description: "Full control over the printed value", type: "(value) => ReactNode", default: "-" },
            { property: "valueStyle", description: "Inline style for the value line", type: "CSSProperties", default: "-" },
          ],
        },
      ]}
    />
  );
}
