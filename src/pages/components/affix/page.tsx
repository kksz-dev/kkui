import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import OnChange from "./demos/on-change";
import onChangeCode from "./demos/on-change.tsx?raw";
import Target from "./demos/target";
import targetCode from "./demos/target.tsx?raw";
import Debug from "./demos/debug";
import debugCode from "./demos/debug.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="affix"
      imports={["Affix"]}
      whenToUse={tr(
        <>
          <p>
            Affix ตรึงองค์ประกอบให้มองเห็นตลอดเวลาที่หน้าเลื่อน: เมื่อองค์ประกอบกำลังจะหลุดออกจาก viewport (หรือ container ที่ระบุด้วย <code>target</code>)
            มันจะถูกสลับเป็น <code>position: fixed</code> ที่ระยะ <code>offsetTop</code> / <code>offsetBottom</code> และมี placeholder จองที่เดิมไว้ใน flow
          </p>
          <ul>
            <li>ใช้กับ toolbar แถบตัวกรอง หัวตาราง หรือปุ่ม "กลับขึ้นบน" ที่ต้องกดถึงได้ตลอดในหน้ายาวๆ</li>
            <li>มีผลทีละค่าเดียวระหว่าง <code>offsetTop</code> กับ <code>offsetBottom</code> ถ้าใส่ทั้งคู่ ค่าฝั่งบนจะชนะ</li>
            <li>ถ้าต้องการตรึงภายใน container ที่เลื่อนเองแทน window ให้ส่ง <code>target</code> เป็นฟังก์ชันที่คืน element นั้น</li>
          </ul>
        </>,
        <>
          <p>
            Affix keeps an element visible while the page scrolls: once the element would leave the viewport (or its <code>target</code> container) it is
            switched to <code>position: fixed</code> at <code>offsetTop</code> / <code>offsetBottom</code>, and a placeholder holds its spot in the flow.
          </p>
          <ul>
            <li>Use it for toolbars, filter bars, table headers or "back to top" actions that should stay reachable on long pages.</li>
            <li>Only <code>offsetTop</code> or <code>offsetBottom</code> is honoured; when both are set the top one wins.</li>
            <li>For a scrolling container instead of the window, pass <code>target</code> — a function returning that element.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr(<>ลองเลื่อนหน้าดู: ปุ่มแรกตรึงห่างจากขอบบนเท่ากับ <code>offsetTop</code> ส่วนปุ่มที่สองตรึงห่างจากขอบล่างเท่ากับ <code>offsetBottom</code></>, <>Scroll the page: the first button sticks <code>offsetTop</code> from the top, the second one <code>offsetBottom</code> from the bottom.</>), code: basicCode, component: <Basic /> },
        { title: tr("แจ้งเมื่อสถานะเปลี่ยน", "Callback"), description: tr(<><code>onChange</code> ถูกเรียกทุกครั้งที่สถานะตรึงเปลี่ยน</>, <><code>onChange</code> fires whenever the affixed state flips.</>), code: onChangeCode, component: <OnChange /> },
        { title: tr("ตรึงใน container ที่เลื่อนได้", "Container to scroll"), description: tr(<>ตั้ง <code>target</code> เพื่อตรึงภายใน element ที่เลื่อนได้ แทนการอิงกับ window</>, <>Set <code>target</code> to affix inside a scrolling element instead of the window.</>), code: targetCode, component: <Target /> },
        { title: tr("ปรับระยะ offset", "Adjust offset"), description: tr(<>เปลี่ยน <code>offsetTop</code> ระหว่างรัน แล้ววัดตำแหน่งใหม่ทันที</>, <>Changing <code>offsetTop</code> at runtime re-measures immediately.</>), code: debugCode, component: <Debug /> },
      ]}
      api={[
        {
          title: "Affix",
          rows: [
            { property: "offsetBottom", description: "Offset from the bottom of the viewport (in pixels)", type: "number", default: "-" },
            { property: "offsetTop", description: "Offset from the top of the viewport (in pixels)", type: "number", default: "0" },
            { property: "target", description: "Specifies the scrollable area DOM node", type: "() => HTMLElement | Window | null", default: "() => window" },
            { property: "onChange", description: "Callback for when Affix state is changed", type: "(affixed: boolean) => void", default: "-" },
            { property: "className", description: "Placeholder wrapper className", type: "string", default: "-" },
          ],
        },
      ]}
      extra={
        <>
          <h2>FAQ</h2>
          <h3>The affixed element does not line up with its neighbours after the layout changes.</h3>
          <p>
            Affix measures the placeholder on scroll / resize and observes its own content and target with <code>ResizeObserver</code>. If an ancestor
            changes size without triggering any of those, dispatch a <code>resize</code> event on <code>window</code>.
          </p>
          <h3>Can I put it inside an element with <code>overflow: hidden</code>?</h3>
          <p>Yes: the fixed layer is positioned against the viewport, so clipping ancestors do not affect it (except <code>transform</code>ed ones).</p>
        </>
      }
      related={[{ title: "Anchor", path: "/components/anchor" }, { title: "BackTop", path: "/components/float-button" }]}
    />
  );
}
