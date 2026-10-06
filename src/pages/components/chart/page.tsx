import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import LineDemo from "./demos/line";
import lineCode from "./demos/line.tsx?raw";
import AreaDemo from "./demos/area";
import areaCode from "./demos/area.tsx?raw";
import BarDemo from "./demos/bar";
import barCode from "./demos/bar.tsx?raw";
import DonutDemo from "./demos/donut";
import donutCode from "./demos/donut.tsx?raw";
import SparklineDemo from "./demos/sparkline";
import sparklineCode from "./demos/sparkline.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="chart"
      imports={["LineChart", "AreaChart", "BarChart", "DonutChart", "Sparkline"]}
      whenToUse={tr(
        <>
          <p>ใช้กับกราฟทั่วไปบนแดชบอร์ด — เส้น พื้นที่ แท่ง โดนัท และ sparkline วาดด้วย SVG ล้วน ไม่มี dependency เพิ่ม</p>
          <p className="mt-2 text-text-tertiary">ถ้าต้องการกราฟเฉพาะทาง (candlestick, heatmap, แกนหลายชั้น) ควรใช้ไลบรารีกราฟเต็มรูปแบบแทน</p>
        </>,
        <>
          <p>Use for the charts a dashboard actually needs: line, area, bar, donut and sparkline, drawn in SVG with no extra dependency.</p>
          <p className="mt-2 text-text-tertiary">Reach for a full charting library when the shape is specialised — candlesticks, heatmaps, multiple stacked axes.</p>
        </>,
      )}
      demos={[
        {
          title: tr("กราฟเส้น", "Line"),
          description: tr(
            "หลายชุดข้อมูล เส้นโค้ง และ tooltip ที่ควบคุมได้ทั้ง pointer และ keyboard",
            "Multiple series, a smoothed curve, and a tooltip controlled by pointer or keyboard.",
          ),
          code: lineCode,
          component: <LineDemo />,
          size: "full",
        },
        {
          title: tr("กราฟพื้นที่", "Area"),
          description: tr("เติมพื้นที่ใต้เส้น เหมาะกับปริมาณสะสมรายวัน", "Filled under the line — good for daily volume."),
          code: areaCode,
          component: <AreaDemo />,
          size: "full",
        },
        {
          title: tr("กราฟแท่ง", "Bar"),
          description: tr("สลับได้ระหว่างแบบเคียงกัน ซ้อนกัน และแนวนอน", "Switch between grouped, stacked and horizontal."),
          code: barCode,
          component: <BarDemo />,
          size: "full",
        },
        {
          title: tr("โดนัท", "Donut"),
          description: tr(
            "สัดส่วนพร้อมยอดรวมตรงกลาง เลือกชิ้นด้วย pointer หรือ keyboard เพื่อดูตัวเลข",
            "Proportions with a total in the middle; select a slice by pointer or keyboard to inspect it.",
          ),
          code: donutCode,
          component: <DonutDemo />,
          size: "standard",
        },
        {
          title: tr("Sparkline", "Sparkline"),
          description: tr("กราฟจิ๋วสำหรับวางในการ์ดตัวเลข", "Tiny series for a metric card."),
          code: sparklineCode,
          component: <SparklineDemo />,
          size: "compact",
        },
      ]}
      api={[
        {
          title: "LineChart / AreaChart",
          rows: [
            { property: "data", description: "Rows, one per category", type: "Record<string, string | number>[]", default: "[]" },
            { property: "series", description: "Which fields to draw", type: "{ key, name?, color? }[]", default: "[]" },
            { property: "xKey", description: "Field holding the category name", type: "string", default: "'label'" },
            { property: "area", description: "Fill under the line (AreaChart sets it)", type: "boolean", default: "false" },
            { property: "curve", description: "Smooth the joins", type: "boolean", default: "true" },
            { property: "dots", description: "Dots at every point", type: "boolean", default: "false" },
            { property: "domain", description: "Fix the value axis", type: "[number, number]", default: "from data" },
            { property: "valueFormatter", description: "Axis and tooltip formatting", type: "(value) => string", default: "toLocaleString" },
            { property: "grid / yAxis / xAxis / legend", description: "Grid, value axis, category axis, and legend", type: "boolean", default: "true" },
            { property: "height", description: "Chart height in px", type: "number", default: "220" },
            { property: "padding", description: "Override plot gutters", type: "Partial<ChartPadding>", default: "12 / 12 / 26 / 44" },
            { property: "ariaLabel", description: "Accessible chart name", type: "string", default: "-" },
            { property: "activeIndex", description: "Controlled active datum", type: "number | null", default: "uncontrolled" },
            { property: "onActiveIndexChange", description: "Active datum change callback", type: "(index) => void", default: "-" },
            { property: "onDatumClick", description: "Datum click or keyboard activation callback", type: "(datum, index, series?) => void", default: "-" },
            { property: "DOM props / ref", description: "Passed to the root div", type: "ComponentProps<'div'>", default: "-" },
          ],
        },
        {
          title: "BarChart",
          rows: [
            { property: "stacked", description: "Stack the series", type: "boolean", default: "false" },
            { property: "horizontal", description: "Bars run left to right", type: "boolean", default: "false" },
            { property: "radius", description: "Corner radius of a bar", type: "number", default: "4" },
            { property: "padding", description: "Plot gutters; horizontal bars default to a 96px left gutter", type: "Partial<ChartPadding>", default: "orientation-aware" },
          ],
        },
        {
          title: "DonutChart",
          rows: [
            { property: "data", description: "Slices", type: "{ key, label?, value, color? }[]", default: "[]" },
            { property: "size", description: "Diameter in px", type: "number", default: "180" },
            { property: "thickness", description: "Ring width; 0 makes a pie", type: "number", default: "28" },
            { property: "center", description: "Content in the middle", type: "ReactNode", default: "-" },
            { property: "legend", description: "Show the list beside the ring", type: "boolean", default: "true" },
            { property: "ariaLabel", description: "Accessible chart name", type: "string", default: "-" },
            { property: "activeIndex", description: "Controlled active slice", type: "number | null", default: "uncontrolled" },
            { property: "onActiveIndexChange", description: "Active slice change callback", type: "(index) => void", default: "-" },
            { property: "onDatumClick", description: "Slice click or keyboard activation callback", type: "(slice, index) => void", default: "-" },
            { property: "DOM props / ref", description: "Passed to the root div", type: "ComponentProps<'div'>", default: "-" },
          ],
        },
        {
          title: "Sparkline",
          rows: [
            { property: "data", description: "Values", type: "number[]", default: "[]" },
            { property: "width / height", description: "Size in px", type: "number", default: "96 / 32" },
            { property: "color", description: "Any CSS colour", type: "string", default: "chart-1" },
            { property: "area", description: "Fill under the line", type: "boolean", default: "true" },
            { property: "showLast", description: "Dot on the final point", type: "boolean", default: "true" },
            { property: "ariaLabel", description: "Accessible name; otherwise decorative", type: "string", default: "-" },
            { property: "SVG props / ref", description: "Passed to the root svg", type: "ComponentProps<'svg'>", default: "-" },
          ],
        },
      ]}
      related={[{ path: "/components/stat-card", title: "StatCard" }, { path: "/components/statistic", title: "Statistic" }]}
    />
  );
}
