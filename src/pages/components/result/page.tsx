import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Success from "./demos/success";
import successCode from "./demos/success.tsx?raw";
import Info from "./demos/info";
import infoCode from "./demos/info.tsx?raw";
import Warning from "./demos/warning";
import warningCode from "./demos/warning.tsx?raw";
import Forbidden from "./demos/403";
import forbiddenCode from "./demos/403.tsx?raw";
import NotFound from "./demos/404";
import notFoundCode from "./demos/404.tsx?raw";
import ServerError from "./demos/500";
import serverErrorCode from "./demos/500.tsx?raw";
import ErrorDemo from "./demos/error";
import errorCode from "./demos/error.tsx?raw";
import CustomIcon from "./demos/custom-icon";
import customIconCode from "./demos/custom-icon.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="result"
      imports={["Result"]}
      whenToUse={tr(
        <>
          <p>ใช้ Result บอกผลลัพธ์ของทั้งขั้นตอน เช่น สั่งซื้อสำเร็จ ฟอร์มไม่ผ่านการตรวจสอบ หรือเข้าหน้านั้นไม่ได้</p>
          <ul>
            <li>กินพื้นที่ทั้งหน้าหรือทั้งพาเนล จึงควรใช้กับผลลัพธ์รวม ไม่ใช่ข้อความเตือนรายฟิลด์</li>
            <li>สถานะ <code>403</code>, <code>404</code> และ <code>500</code> มีภาพประกอบมาให้สำหรับหน้า exception</li>
            <li>วางปุ่มดำเนินการต่อไว้ใน <code>extra</code> ส่วนรายละเอียด (เช่น รายการสิ่งที่ผิดพลาด) ให้ใส่ใน children</li>
          </ul>
        </>,
        <>
          <p>Use Result to tell the user how a whole flow ended: an order was placed, a form failed validation, or a page cannot be reached.</p>
          <ul>
            <li>It fills a page or panel, so reserve it for outcomes rather than inline field feedback.</li>
            <li>The <code>403</code>, <code>404</code> and <code>500</code> statuses ship with small illustrations for exception pages.</li>
            <li>Put follow-up actions in <code>extra</code>; put details (like a list of what went wrong) in the children block.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("สำเร็จ", "Success"), description: tr("แสดงผลลัพธ์ที่สำเร็จ", "Show successful results."), code: successCode, component: <Success /> },
        { title: tr("ข้อมูล", "Info"), description: tr("แสดงผลระหว่างดำเนินการ (สถานะเริ่มต้น)", "Show processing results (default status)."), code: infoCode, component: <Info /> },
        { title: tr("คำเตือน", "Warning"), description: tr("ผลลัพธ์แบบคำเตือน", "The result of the warning."), code: warningCode, component: <Warning /> },
        { title: "403", description: tr("ไม่มีสิทธิ์เข้าถึงหน้านี้", "You are not authorized to access this page."), code: forbiddenCode, component: <Forbidden /> },
        { title: "404", description: tr("ไม่พบหน้าที่เรียก", "The page you visited does not exist."), code: notFoundCode, component: <NotFound /> },
        { title: "500", description: tr("เซิร์ฟเวอร์เกิดข้อผิดพลาด", "The server is wrong."), code: serverErrorCode, component: <ServerError /> },
        { title: tr("ข้อผิดพลาด", "Error"), description: tr("แจ้งข้อผิดพลาดพร้อมรายละเอียดในบล็อกเนื้อหา", "Complex error feedback with a content block."), code: errorCode, component: <ErrorDemo />, full: true },
        { title: tr("ไอคอนกำหนดเอง", "Custom Icon"), description: tr(<>ส่ง <code>icon</code> เพื่อใช้ภาพของเราเอง</>, <>Pass <code>icon</code> to use your own graphic.</>), code: customIconCode, component: <CustomIcon /> },
      ]}
      api={[
        {
          title: "Result",
          rows: [
            { property: "status", description: "Result status, decide icons and colors", type: "success | error | info | warning | 404 | 403 | 500", default: "info" },
            { property: "title", description: "The title", type: "ReactNode", default: "-" },
            { property: "subTitle", description: "The subTitle", type: "ReactNode", default: "-" },
            { property: "icon", description: "Custom back icon", type: "ReactNode", default: "-" },
            { property: "extra", description: "Operating area", type: "ReactNode", default: "-" },
            { property: "children", description: "Content block rendered under the title (grey panel)", type: "ReactNode", default: "-" },
            { property: "className", description: "Extra classes on the root", type: "string", default: "-" },
          ],
        },
      ]}
      related={[{ title: "Alert", path: "/components/alert" }, { title: "Empty", path: "/components/empty" }]}
    />
  );
}
