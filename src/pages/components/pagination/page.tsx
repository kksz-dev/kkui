import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import More from "./demos/more";
import moreCode from "./demos/more.tsx?raw";
import Changer from "./demos/changer";
import changerCode from "./demos/changer.tsx?raw";
import Jump from "./demos/jump";
import jumpCode from "./demos/jump.tsx?raw";
import Mini from "./demos/mini";
import miniCode from "./demos/mini.tsx?raw";
import Simple from "./demos/simple";
import simpleCode from "./demos/simple.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import Total from "./demos/total";
import totalCode from "./demos/total.tsx?raw";
import All from "./demos/all";
import allCode from "./demos/all.tsx?raw";
import ItemRender from "./demos/item-render";
import itemRenderCode from "./demos/item-render.tsx?raw";
import Align from "./demos/align";
import alignCode from "./demos/align.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="pagination"
      imports={["Pagination"]}
      whenToUse={
        <>
          <p>A long list can be divided into several pages using Pagination, and only one page will be loaded at a time.</p>
          <ul>
            <li>When it will take a long time to load or render all items.</li>
            <li>If you want to browse the data by navigating through pages.</li>
          </ul>
        </>
      }
      demos={[
        { title: "Basic", description: "Basic pagination.", code: basicCode, component: <Basic /> },
        { title: "More", description: "More pages: ellipsis buttons jump 5 pages at a time.", code: moreCode, component: <More /> },
        { title: "Changer", description: <>Change <code>pageSize</code> with the size select. It shows automatically when <code>total</code> exceeds 50.</>, code: changerCode, component: <Changer /> },
        { title: "Jumper", description: "Quickly jump to a page.", code: jumpCode, component: <Jump /> },
        { title: "Mini size", description: <><code>size="small"</code>: 24px items without borders.</>, code: miniCode, component: <Mini /> },
        { title: "Simple mode", description: tr(<>โหมด <code>simple</code>; <code>{`{ readOnly: true }`}</code> ซ่อนช่องกรอก และ <code>responsive</code> จะสลับมาโหมดนี้เองเมื่อจอแคบ</>, <><code>simple</code> mode; <code>{`{ readOnly: true }`}</code> hides the input. <code>responsive</code> switches to this mode on narrow screens.</>), code: simpleCode, component: <Simple /> },
        { title: "Controlled", description: <>Controlled page number with <code>current</code> + <code>onChange</code>.</>, code: controlledCode, component: <Controlled /> },
        { title: "Total number", description: <>Show the total with <code>showTotal(total, [from, to])</code>.</>, code: totalCode, component: <Total /> },
        { title: "Show All", description: "Size changer, quick jumper and total together.", code: allCode, component: <All /> },
        { title: "Prev and next", description: <>Use <code>itemRender</code> to replace the prev/next buttons with text.</>, code: itemRenderCode, component: <ItemRender /> },
        { title: "Align", description: <>Set <code>align</code> to start / center / end.</>, code: alignCode, component: <Align /> },
        { title: "Disabled", description: "Disabled state.", code: disabledCode, component: <Disabled /> },
      ]}
      api={[
        {
          title: "Pagination",
          rows: [
            { property: "align", description: "Align", type: "start | center | end", default: "start" },
            { property: "current", description: "Current page number", type: "number", default: "-" },
            { property: "defaultCurrent", description: "Default initial page number", type: "number", default: "1" },
            { property: "defaultPageSize", description: "Default number of data items per page", type: "number", default: "10" },
            { property: "disabled", description: "Disable pagination", type: "boolean", default: "-" },
            { property: "hideOnSinglePage", description: "Whether to hide pager on single page", type: "boolean", default: "false" },
            { property: "itemRender", description: "To customize item's innerHTML", type: "(page, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement) => ReactNode", default: "-" },
            { property: "pageSize", description: "Number of data items per page", type: "number", default: "-" },
            { property: "pageSizeOptions", description: "Specify the sizeChanger options", type: "number[]", default: "[10, 20, 50, 100]" },
            { property: "responsive", description: tr("จอแคบกว่า 576px จะสลับไปโหมด simple ทั้งตัว และซ่อนตัวเปลี่ยนขนาดหน้า/ช่องกระโดด", "Below 576px the whole pager switches to simple mode and the size changer / quick jumper are hidden"), type: "boolean", default: "false" },
            { property: "showLessItems", description: "Show less page items", type: "boolean", default: "false" },
            { property: "showQuickJumper", description: "Determine whether you can jump to pages directly", type: "boolean | { goButton: ReactNode | true }", default: "false" },
            { property: "showSizeChanger", description: "Determine whether to show pageSize select", type: "boolean | { options?, disabled? }", default: "total > 50" },
            { property: "showTitle", description: "Show page item's title", type: "boolean", default: "true" },
            { property: "showTotal", description: "To display the total number and range", type: "(total, range: [number, number]) => ReactNode", default: "-" },
            { property: "simple", description: "Whether to use simple mode", type: "boolean | { readOnly?: boolean }", default: "-" },
            { property: "size", description: "Specify the size of Pagination", type: "default | small", default: "default" },
            { property: "total", description: "Total number of data items", type: "number", default: "0" },
            { property: "totalBoundaryShowSizeChanger", description: "Show size changer when total is larger than this", type: "number", default: "50" },
            { property: "onChange", description: "Called when the page number or pageSize is changed", type: "(page, pageSize) => void", default: "-" },
            { property: "onShowSizeChange", description: "Called when pageSize is changed", type: "(current, size) => void", default: "-" },
            { property: "locale", description: "Texts: items_per_page, jump_to, page, prev_page, next_page", type: "object", default: "-" },
          ],
        },
      ]}
    />
  );
}
