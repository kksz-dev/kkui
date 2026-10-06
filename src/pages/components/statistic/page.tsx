import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Unit from "./demos/unit";
import unitCode from "./demos/unit.tsx?raw";
import CardDemo from "./demos/card";
import cardCode from "./demos/card.tsx?raw";
import Countdown from "./demos/countdown";
import countdownCode from "./demos/countdown.tsx?raw";
import Timer from "./demos/timer";
import timerCode from "./demos/timer.tsx?raw";
import Animated from "./demos/animated";
import animatedCode from "./demos/animated.tsx?raw";
import Loading from "./demos/loading";
import loadingCode from "./demos/loading.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="statistic"
      imports={["Statistic", "StatisticCountdown", "StatisticTimer"]}
      whenToUse={tr(
        <>
          <p>ใช้เมื่อต้องแสดงตัวเลขสถิติเด่นๆ ค่า KPI หรือเวลานับถอยหลัง</p>
          <ul>
            <li>แสดงการ์ดตัวเลขเดี่ยวหรือค่าสรุปบนแดชบอร์ด</li>
            <li>เน้นตัวเลขแนวโน้มด้วย prefix, suffix, สไตล์ที่กำหนดเอง หรือไอคอนบอกทิศทางการเปลี่ยนแปลง</li>
            <li>นับถอยหลังถึงเวลาเป้าหมาย หรือจับเวลาที่ผ่านไปด้วย <code>StatisticCountdown</code> และ <code>StatisticTimer</code></li>
          </ul>
        </>,
        <>
          <p>When you need to display prominent statistics, numerical highlights, KPIs, or countdown timers.</p>
          <ul>
            <li>Display single numerical cards or summary metrics in a dashboard.</li>
            <li>Highlight trend metrics with prefixes, suffixes, custom styling, or change icons.</li>
            <li>Show target deadline countdowns or elapsed stopwatch times with <code>StatisticCountdown</code> and <code>StatisticTimer</code>.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("การใช้งานพื้นฐาน กำหนดทศนิยมและสีตามแนวโน้ม", "Simplest usage with precision and trend colors."), code: basicCode, component: <Basic /> },
        { title: tr("หน่วยและไอคอน", "Unit and Icons"), description: tr("ใส่ prefix หรือ suffix เพื่อบอกหน่วยและบริบทของตัวเลข", "Add prefix or suffix to describe unit and context."), code: unitCode, component: <Unit /> },
        { title: tr("ในการ์ด", "In Card"), description: tr("วาง Statistic ไว้ในคอนเทนเนอร์ Card", "Displaying statistics inside Card containers."), code: cardCode, component: <CardDemo /> },
        { title: tr("นับถอยหลัง", "Countdown"), description: tr("นับถอยหลังถึงเวลาเป้าหมาย ปรับรูปแบบการแสดงผลได้", "Deadline countdown with format customization."), code: countdownCode, component: <Countdown /> },
        { title: tr("จับเวลา (นับขึ้น / นับลง)", "Timer (Count Up / Down)"), description: tr("นับขึ้นหรือนับลง โดยตั้ง timestamp เริ่มต้นหรือเป้าหมายได้", "Count up or down with configurable start/target timestamps."), code: timerCode, component: <Timer /> },
        { title: tr("ตัวเลขเคลื่อนไหว", "Animated Number"), description: tr("ไล่ตัวเลขแบบ easing ด้วย requestAnimationFrame", "Smooth easing number animation using requestAnimationFrame."), code: animatedCode, component: <Animated /> },
        { title: tr("กำลังโหลด", "Loading"), description: tr("แสดง skeleton ระหว่างรอข้อมูลแบบ asynchronous", "Loading skeleton state for asynchronous data fetching."), code: loadingCode, component: <Loading /> },
      ]}
      api={[
        {
          title: "Statistic",
          rows: [
            { property: "title", description: "Title of the statistic", type: "ReactNode", default: "-" },
            { property: "value", description: "Display value", type: "number | string", default: "-" },
            { property: "precision", description: "The precision of input value (decimal places)", type: "number", default: "-" },
            { property: "prefix", description: "Prefix node of value", type: "ReactNode", default: "-" },
            { property: "suffix", description: "Suffix node of value", type: "ReactNode", default: "-" },
            { property: "valueStyle", description: "Custom style for the value element", type: "CSSProperties", default: "-" },
            { property: "groupSeparator", description: "Group separator for thousands", type: "string", default: "','" },
            { property: "decimalSeparator", description: "Decimal separator", type: "string", default: "'.'" },
            { property: "formatter", description: "Custom formatter function", type: "(value: number | string) => ReactNode", default: "-" },
            { property: "loading", description: "Show skeleton loading indicator", type: "boolean", default: "false" },
            { property: "className", description: "Extra classes on root", type: "string", default: "-" },
          ],
        },
        {
          title: "StatisticCountdown",
          description: "Countdown timer component.",
          rows: [
            { property: "value", description: "Target deadline timestamp / Date / ISO string", type: "number | Date | string", default: "-" },
            { property: "format", description: "Format template (e.g. 'HH:mm:ss', 'D 天 H 时 m 分 s 秒', 'HH:mm:ss:SSS')", type: "string", default: "'HH:mm:ss'" },
            { property: "onFinish", description: "Triggered when countdown reaches 0", type: "() => void", default: "-" },
            { property: "onChange", description: "Triggered on each tick with remaining time in ms", type: "(diff: number) => void", default: "-" },
          ],
        },
        {
          title: "StatisticTimer",
          description: "General timer component supporting countdown and countup.",
          rows: [
            { property: "type", description: "Mode of timer", type: "'countdown' | 'countup'", default: "'countdown'" },
            { property: "value", description: "Base timestamp (target or start)", type: "number | Date | string", default: "-" },
            { property: "format", description: "Format template", type: "string", default: "'HH:mm:ss'" },
            { property: "onFinish", description: "Callback on finish (countdown mode)", type: "() => void", default: "-" },
            { property: "onChange", description: "Callback on every tick with current duration/diff in ms", type: "(time: number) => void", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Card", path: "/components/card" }, { title: "Progress", path: "/components/progress" }]}
    />
  );
}
