import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Inside from "./demos/inside";
import insideCode from "./demos/inside.tsx?raw";
import Custom from "./demos/custom";
import customCode from "./demos/custom.tsx?raw";
import Delay from "./demos/delay";
import delayCode from "./demos/delay.tsx?raw";
import Tip from "./demos/tip";
import tipCode from "./demos/tip.tsx?raw";
import Fullscreen from "./demos/fullscreen";
import fullscreenCode from "./demos/fullscreen.tsx?raw";
import PercentDemo from "./demos/percent";
import percentCode from "./demos/percent.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="spin"
      imports={["Spin"]}
      whenToUse={tr(
        <>
          <p>
            Spin ใช้บอกสถานะกำลังโหลดของหน้า การ์ด หรือบางส่วนของหน้า ระหว่างที่ดึงข้อมูลแบบ asynchronous
          </p>
          <p className="mt-2">
            ครอบเนื้อหาไว้ข้างในเพื่อคลุมด้วยสปินเนอร์บนพื้นจาง หรือใช้เดี่ยวๆ เป็นตัวบอกสถานะแบบ inline ก็ได้
          </p>
        </>,
        <>
          <p>
            Spin is used for displaying loading state of a page, card, or section while asynchronous data is being fetched.
          </p>
          <p className="mt-2">
            It can wrap child content to overlay a dimmed spinner on top, or render standalone as an inline indicator.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("การใช้งานพื้นฐาน", "Basic Usage"),
          description: tr(<>สปินเนอร์แบบง่ายที่สุด</>, <>A simple spinning indicator.</>),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ขนาด", "Size"),
          description: tr(<>รองรับขนาด small, default และ large</>, <>Small, default, and large sizes are supported.</>),
          code: sizeCode,
          component: <Size />,
        },
        {
          title: tr("ฝังในคอนเทนเนอร์", "Embedded in Container"),
          description: tr(<>ฝัง Spin ไว้ในคอนเทนเนอร์แล้วสลับสถานะโหลด</>, <>Embed Spin into a container and toggle the loading state.</>),
          code: insideCode,
          component: <Inside />,
        },
        {
          title: tr("กำหนดตัวหมุนเอง", "Custom Indicator"),
          description: tr(<>ใช้ไอคอนหรือ element อื่นแทนตัวหมุนเริ่มต้น</>, <>Use custom icon or element as spinning indicator.</>),
          code: customCode,
          component: <Custom />,
        },
        {
          title: tr("หน่วงเวลา", "Delay"),
          description: tr(<>กำหนดเวลาหน่วงก่อนเข้าสถานะโหลด กันภาพกะพริบเมื่องานเสร็จเร็ว</>, <>Specifies a delay before loading state triggers to prevent flicker on fast actions.</>),
          code: delayCode,
          component: <Delay />,
        },
        {
          title: tr("ข้อความประกอบ", "Customized Description"),
          description: tr(<>ใส่ข้อความใต้สปินเนอร์ด้วย <code>tip</code></>, <>Customize description content with <code>tip</code>.</>),
          code: tipCode,
          component: <Tip />,
        },
        {
          title: tr("เต็มจอ", "Fullscreen"),
          description: tr(<>แสดงสถานะโหลดคลุมทั้งจอ</>, <>Display loading state in full screen mask.</>),
          code: fullscreenCode,
          component: <Fullscreen />,
        },
        {
          title: tr("เปอร์เซ็นต์ความคืบหน้า", "Progress Percent"),
          description: tr(<>แสดงความคืบหน้าเป็นเปอร์เซ็นต์รอบสปินเนอร์ด้วย <code>percent</code></>, <>Show circular progress percentage with <code>percent</code>.</>),
          code: percentCode,
          component: <PercentDemo />,
        },
      ]}
      api={[
        {
          title: "Spin",
          rows: [
            { property: "delay", description: "Specifies a delay in milliseconds for loading state", type: "number", default: "-" },
            { property: "fullscreen", description: "Display fullscreen overlay", type: "boolean", default: "false" },
            { property: "indicator", description: "React node of the spinning indicator", type: "ReactElement", default: "-" },
            { property: "percent", description: "Display progress percent on the spinner", type: "number | 'auto'", default: "-" },
            { property: "size", description: "Size of the spinner", type: "'small' | 'default' | 'large' | 'sm' | 'md' | 'lg'", default: "'default'" },
            { property: "spinning", description: "Whether Spin is spinning", type: "boolean", default: "true" },
            { property: "tip", description: "Customize description text under the spinner", type: "ReactNode", default: "-" },
            { property: "wrapperClassName", description: "The className of wrapper when Spin has children", type: "string", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Progress", path: "/components/progress" },
        { title: "Skeleton", path: "/components/skeleton" },
      ]}
    />
  );
}
