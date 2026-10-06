import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Search from "./demos/search";
import searchCode from "./demos/search.tsx?raw";
import Multiple from "./demos/multiple";
import multipleCode from "./demos/multiple.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import LabelRender from "./demos/label-render";
import labelRenderCode from "./demos/label-render.tsx?raw";
import SearchSort from "./demos/search-sort";
import searchSortCode from "./demos/search-sort.tsx?raw";
import Tags from "./demos/tags";
import tagsCode from "./demos/tags.tsx?raw";
import OptionGroup from "./demos/option-group";
import optionGroupCode from "./demos/option-group.tsx?raw";
import Coordinate from "./demos/coordinate";
import coordinateCode from "./demos/coordinate.tsx?raw";
import SearchBox from "./demos/search-box";
import searchBoxCode from "./demos/search-box.tsx?raw";
import LabelInValue from "./demos/label-in-value";
import labelInValueCode from "./demos/label-in-value.tsx?raw";
import AutomaticTokenization from "./demos/automatic-tokenization";
import automaticTokenizationCode from "./demos/automatic-tokenization.tsx?raw";
import CustomDropdown from "./demos/custom-dropdown";
import customDropdownCode from "./demos/custom-dropdown.tsx?raw";
import HideSelected from "./demos/hide-selected";
import hideSelectedCode from "./demos/hide-selected.tsx?raw";
import CustomTagRender from "./demos/custom-tag-render";
import customTagRenderCode from "./demos/custom-tag-render.tsx?raw";
import Responsive from "./demos/responsive";
import responsiveCode from "./demos/responsive.tsx?raw";
import BigData from "./demos/big-data";
import bigDataCode from "./demos/big-data.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import Suffix from "./demos/suffix";
import suffixCode from "./demos/suffix.tsx?raw";
import MaxCount from "./demos/max-count";
import maxCountCode from "./demos/max-count.tsx?raw";
import VirtualDemo from "./demos/virtual";
import virtualCode from "./demos/virtual.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="select"
      imports={["Select", "SelectOption", "SelectOptGroup"]}
      whenToUse={tr(
        <>
          <ul>
            <li>เมนู dropdown สำหรับเลือกค่า ใช้แทน <code>&lt;select&gt;</code> ของ HTML ที่ตกแต่งได้ยาก</li>
            <li>ถ้าตัวเลือกมีไม่กี่ตัว (น้อยกว่า 5) ใช้ <a href="/components/radio">Radio</a> จะเหมาะกว่า</li>
            <li>เลือกได้หลายค่าด้วย <code>mode="multiple"</code> หรือ <code>mode="tags"</code> และถ้ารายการยาวให้เพิ่ม <code>showSearch</code></li>
          </ul>
        </>,
        <>
          <ul>
            <li>A dropdown menu for displaying choices — an elegant alternative to the native <code>&lt;select&gt;</code> element.</li>
            <li>Utilizing <a href="/components/radio">Radio</a> is recommended when there are fewer total options (less than 5).</li>
            <li>Use <code>mode="multiple"</code> or <code>mode="tags"</code> to pick several values; add <code>showSearch</code> when the list is long.</li>
          </ul>
        </>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic Usage"), description: tr("การใช้งานพื้นฐาน พร้อมสถานะ disabled / loading / allowClear", "Basic usage, plus disabled / loading / allowClear states."), code: basicCode, component: <Basic /> },
        { title: tr("ค้นหาในตัวเลือก", "Select with search field"), description: tr(<>เปิด <code>showSearch</code> เพื่อค้นหาตัวเลือก และใช้ <code>optionFilterProp="label"</code> เมื่อต้องการให้จับคู่กับข้อความที่แสดง</>, <>Search the options while <code>showSearch</code> is set. Use <code>optionFilterProp="label"</code> to match on the visible text.</>), code: searchCode, component: <Search /> },
        { title: tr("เลือกหลายค่า", "Multiple selection"), description: tr(<>เลือกหลายค่าจากรายการที่มีอยู่ด้วย <code>mode="multiple"</code></>, <>Multiple selection, selecting from existing items with <code>mode="multiple"</code>.</>), code: multipleCode, component: <Multiple /> },
        { title: tr("ขนาด", "Sizes"), description: tr(<>พร็อพ <code>size</code>: <code>lg</code> 40px, <code>md</code> 32px, <code>sm</code> 24px</>, <>The <code>size</code> prop: <code>lg</code> 40px, <code>md</code> 32px, <code>sm</code> 24px.</>), code: sizeCode, component: <Size /> },
        { title: tr("กำหนดการแสดงค่าที่เลือก", "Custom selection render"), description: tr(<>เปลี่ยนวิธีแสดง label ของค่าที่เลือกด้วย <code>labelRender</code></>, <>Customize the rendered label of the selected value with <code>labelRender</code>.</>), code: labelRenderCode, component: <LabelRender /> },
        { title: tr("ค้นหาพร้อมเรียงลำดับ", "Search with sort"), description: tr(<>เรียงลำดับผลการค้นหาด้วย <code>filterSort</code></>, <>Search the options with sorting via <code>filterSort</code>.</>), code: searchSortCode, component: <SearchSort /> },
        { title: tr("แท็ก", "Tags"), description: tr(<>โหมดแท็ก เปลี่ยนข้อความที่พิมพ์เป็นแท็ก เลือกจากรายการเดิมหรือสร้างค่าใหม่ก็ได้ โดยกด Enter เพื่อเพิ่มค่าใหม่</>, <>Select with tags, transform typed input into tags. Options can be picked or created; a created value is added on Enter.</>), code: tagsCode, component: <Tags /> },
        { title: tr("จัดกลุ่มตัวเลือก", "Option Group"), description: tr(<>จัดกลุ่มตัวเลือกด้วย <code>options</code> ซ้อนกัน</>, <>Group options with nested <code>options</code>.</>), code: optionGroupCode, component: <OptionGroup /> },
        { title: tr("เลือกต่อเนื่อง", "Coordinate"), description: tr("Select สองตัวที่สัมพันธ์กัน ตัวที่สองขึ้นกับค่าของตัวแรก", "Coordinating two selects — the second one depends on the first."), code: coordinateCode, component: <Coordinate /> },
        { title: tr("ค้นหาจากเซิร์ฟเวอร์", "Search Box"), description: tr(<>ค้นหาจากข้อมูลฝั่ง server: ตั้ง <code>filterOption={"{false}"}</code> คู่กับ <code>onSearch</code> และเปิด <code>loading</code> ระหว่างดึงข้อมูล</>, <>Search with remote data: <code>filterOption={"{false}"}</code> plus <code>onSearch</code>, <code>loading</code> while fetching.</>), code: searchBoxCode, component: <SearchBox /> },
        { title: tr("อ่านค่าของรายการที่เลือก", "Get value of selected item"), description: tr(<>ปกติ <code>onChange</code> จะได้แค่ value แต่ถ้าเปิด <code>labelInValue</code> จะได้ <code>{"{ value, label }"}</code></>, <>As a default behavior, <code>onChange</code> can only get the value; with <code>labelInValue</code> it gets <code>{"{ value, label }"}</code>.</>), code: labelInValueCode, component: <LabelInValue /> },
        { title: tr("ตัดคำเป็นแท็กอัตโนมัติ", "Automatic tokenization"), description: tr(<>ลองคัดลอก <code>a10,b11 c12</code> มาวาง — <code>tokenSeparators</code> จะตัดออกเป็นแท็กให้</>, <>Try to copy <code>a10,b11 c12</code> and paste it — <code>tokenSeparators</code> splits it into tags.</>), code: automaticTokenizationCode, component: <AutomaticTokenization /> },
        { title: tr("กำหนด dropdown เอง", "Custom dropdown"), description: tr(<>ปรับเนื้อหาใน popup ด้วย <code>popupRender</code> เช่น เพิ่มแถบ "เพิ่มรายการ" ไว้ด้านล่าง</>, <>Customize the dropdown content with <code>popupRender</code>, e.g. an "add item" footer.</>), code: customDropdownCode, component: <CustomDropdown /> },
        { title: tr("ซ่อนรายการที่เลือกแล้ว", "Hide Already Selected"), description: tr("กรองตัวเลือกที่เลือกไปแล้วออกจาก dropdown", "Hide the selected options in the dropdown by filtering them out."), code: hideSelectedCode, component: <HideSelected /> },
        { title: tr("กำหนดหน้าตาแท็กเอง", "Custom Tag Render"), description: tr(<>เปลี่ยนวิธี render แท็กด้วย <code>tagRender</code></>, <>Allows custom rendering of tags with <code>tagRender</code>.</>), code: customTagRenderCode, component: <CustomTagRender /> },
        { title: tr("maxTagCount แบบ responsive", "Responsive maxTagCount"), description: tr(<><code>maxTagCount="responsive"</code> ยุบแท็กที่ล้นออกเป็นชิป <code>+ N ...</code> ส่วนการใส่เป็นตัวเลขคือจำกัดจำนวนตายตัว</>, <><code>maxTagCount="responsive"</code> collapses the tags that do not fit into a <code>+ N ...</code> chip; a number caps them explicitly.</>), code: responsiveCode, component: <Responsive /> },
        { title: tr("ข้อมูลจำนวนมาก", "Big Data"), description: tr("ตัวเลือก 10,000 รายการจะ render เมื่อเปิด popup เท่านั้น และยังกรองได้ลื่น", "10,000 options are rendered on demand only when the popup is open. Filtering stays snappy."), code: bigDataCode, component: <BigData /> },
        { title: tr("สถานะ", "Status"), description: tr(<>ใส่ <code>status</code> เป็น <code>error</code> หรือ <code>warning</code></>, <>Add <code>status</code> to Select with <code>error</code> or <code>warning</code>.</>), code: statusCode, component: <Status /> },
        { title: tr("ตำแหน่ง popup", "Placement"), description: tr(<>กำหนดตำแหน่งที่ popup เปิดออกมาเองได้ด้วย <code>placement</code></>, <>You can manually specify the position of the popup via <code>placement</code>.</>), code: placementCode, component: <Placement /> },
        { title: tr("รูปแบบ", "Variants"), description: tr(<>รูปแบบของ Select: <code>outlined</code> (ค่าเริ่มต้น), <code>filled</code>, <code>borderless</code>, <code>underlined</code></>, <>Variants of Select: <code>outlined</code> (default), <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>), code: variantCode, component: <Variant /> },
        { title: tr("prefix และ suffix", "Prefix and Suffix"), description: tr(<>กำหนด <code>prefix</code> และ <code>suffixIcon</code> เองได้ ส่วน <code>suffixIcon={"{null}"}</code> จะซ่อนลูกศร</>, <>Custom <code>prefix</code> and <code>suffixIcon</code>; <code>suffixIcon={"{null}"}</code> hides the arrow.</>), code: suffixCode, component: <Suffix /> },
        { title: tr("จำกัดจำนวนที่เลือก", "Max Count"), description: tr(<>จำกัดจำนวนรายการที่เลือกได้ด้วย <code>maxCount</code> เมื่อครบแล้วตัวเลือกที่เหลือจะถูก disable</>, <>Limit the number of selected items with <code>maxCount</code>; further options become disabled.</>), code: maxCountCode, component: <MaxCount /> },
        {
          title: tr("รายการเสมือน", "Virtual List"),
          description: tr(
            "ตัวเลือก 5,000 รายการยังลื่น เพราะ mount เฉพาะแถวที่มองเห็น",
            "5,000 options stay smooth: only the visible rows are mounted.",
          ),
          code: virtualCode,
          component: <VirtualDemo />,
        },
      ]}
      api={[
        {
          title: "Select",
          description: "Generic on the value type: Select<T = string | number, O = SelectOptionType>.",
          rows: [
            { property: "allowClear", description: "Show the clear button", type: "boolean | { clearIcon?: ReactNode }", default: "false" },
            { property: "autoClearSearchValue", description: "Whether the current search will be cleared on selecting an item (multiple / tags)", type: "boolean", default: "true" },
            { property: "autoFocus", description: "Focus on mount", type: "boolean", default: "false" },
            { property: "defaultActiveFirstOption", description: "Whether the first option is active by default", type: "boolean", default: "true" },
            { property: "defaultOpen", description: "Initial open state of the dropdown", type: "boolean", default: "-" },
            { property: "defaultValue", description: "Initial selected option", type: "string | string[] | number | number[] | LabeledValue | LabeledValue[]", default: "-" },
            { property: "disabled", description: "Whether disabled", type: "boolean", default: "false" },
            { property: "popupClassName", description: "Class name of the dropdown", type: "string", default: "-" },
            { property: "popupMatchSelectWidth", description: "Whether the dropdown width matches the select. false = min-width only; number = fixed width", type: "boolean | number", default: "true" },
            { property: "popupRender", description: "Customize dropdown content (receives the menu)", type: "(menu: ReactElement) => ReactNode", default: "-" },
            { property: "popupStyle", description: "Style of the dropdown", type: "CSSProperties", default: "-" },
            { property: "fieldNames", description: "Customize node label, value, options, groupLabel field names", type: "{ label, value, options, groupLabel }", default: "{ label: 'label', value: 'value', options: 'options', groupLabel: 'label' }" },
            { property: "filterOption", description: "If true, filter options by input; if function, filter options against it (input, option) => boolean", type: "boolean | function", default: "true" },
            { property: "filterSort", description: "Sort function for search options sorting", type: "(optionA, optionB, info: { searchValue }) => number", default: "-" },
            { property: "labelInValue", description: "Whether to embed label in value: { value, label }", type: "boolean", default: "false" },
            { property: "labelRender", description: "Customize the label of the selected value", type: "(props: LabeledValue) => ReactNode", default: "-" },
            { property: "listHeight", description: "Config popup max height", type: "number", default: "256" },
            { property: "loading", description: "Indicate loading state", type: "boolean", default: "false" },
            { property: "maxCount", description: "The max number of items can be selected (multiple / tags)", type: "number", default: "-" },
            { property: "maxTagCount", description: "Max tag count to show; responsive collapses tags that do not fit", type: "number | 'responsive'", default: "-" },
            { property: "maxTagPlaceholder", description: "Placeholder for not showing tags", type: "ReactNode | (omittedValues: LabeledValue[]) => ReactNode", default: "-" },
            { property: "maxTagTextLength", description: "Max tag text length to show", type: "number", default: "-" },
            { property: "menuItemSelectedIcon", description: "The custom menuItemSelected icon (multiple mode)", type: "ReactNode", default: "-" },
            { property: "mode", description: "Set mode of Select", type: "multiple | tags", default: "-" },
            { property: "notFoundContent", description: "Specify content to show when no result matches", type: "ReactNode", default: "Not Found" },
            { property: "open", description: "Controlled open state of dropdown", type: "boolean", default: "-" },
            { property: "optionFilterProp", description: "Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label", type: "string", default: "value" },
            { property: "optionLabelProp", description: "Which prop value of option will render as content of select", type: "string", default: "label" },
            { property: "options", description: "Select options. Will get better perf than jsx definition", type: "{ label, value, disabled?, title?, options?(group) }[]", default: "-" },
            { property: "optionRender", description: "Customize the rendering dropdown options", type: "(option: O, info: { index: number }) => ReactNode", default: "-" },
            { property: "placeholder", description: "Placeholder of select", type: "ReactNode", default: "-" },
            { property: "placement", description: "The position where the selection box pops up", type: "bottomLeft | bottomRight | topLeft | topRight", default: "bottomLeft" },
            { property: "prefix", description: "The custom prefix", type: "ReactNode", default: "-" },
            { property: "removeIcon", description: "The custom remove icon (tags)", type: "ReactNode", default: "-" },
            { property: "searchValue", description: "The current input \"search\" text", type: "string", default: "-" },
            { property: "showSearch", description: "Whether select is searchable", type: "boolean", default: "single: false, multiple: true" },
            { property: "size", description: "Size of Select input", type: "sm | md | lg", default: "md" },
            { property: "status", description: "Set validation status", type: "error | warning", default: "-" },
            { property: "suffixIcon", description: "The custom suffix icon; null hides the arrow", type: "ReactNode", default: "<ChevronDown />" },
            { property: "tagRender", description: "Customize tag render, only applies when mode is set to multiple or tags", type: "(props: { label, value, disabled, closable, onClose }) => ReactNode", default: "-" },
            { property: "tokenSeparators", description: "Separator used to tokenize, only applies when mode=\"tags\" / \"multiple\"", type: "string[]", default: "-" },
            { property: "value", description: "Current selected option (considered as a controlled prop)", type: "T | null", default: "-" },
            { property: "variant", description: "Variants of selector", type: "outlined | borderless | filled | underlined", default: "outlined" },
            { property: "onBlur", description: "Called when blur", type: "function", default: "-" },
            { property: "onChange", description: "Called when select an option or input value change", type: "(value: T, option: O | O[]) => void", default: "-" },
            { property: "onClear", description: "Called when clear", type: "() => void", default: "-" },
            { property: "onDeselect", description: "Called when an option is deselected (multiple / tags)", type: "(value, option) => void", default: "-" },
            { property: "onOpenChange", description: "Called when dropdown open state changes", type: "(open: boolean) => void", default: "-" },
            { property: "onFocus", description: "Called when focus", type: "function", default: "-" },
            { property: "onInputKeyDown", description: "Called when key pressed in the search input", type: "KeyboardEventHandler", default: "-" },
            { property: "onPopupScroll", description: "Called when dropdown scrolls", type: "UIEventHandler", default: "-" },
            { property: "onSearch", description: "Callback function that is fired when input changed", type: "(value: string) => void", default: "-" },
            { property: "onSelect", description: "Called when an option is selected, the params are option's value (or key) and option instance", type: "(value, option) => void", default: "-" },
            { property: "virtual", description: "Window the option list", type: "boolean", default: "options > 60" },
            { property: "optionHeight", description: "Row height used by the windowed list", type: "number", default: "32" },
            { property: "getPopupContainer", description: "Mount the popup elsewhere", type: "(trigger) => HTMLElement", default: "document.body" },
          ],
        },
        {
          title: "SelectOption",
          description: "Declarative alternative to `options`; renders nothing itself.",
          rows: [
            { property: "value", description: "Default to filter with this property", type: "string | number", default: "-" },
            { property: "disabled", description: "Disable this option", type: "boolean", default: "false" },
            { property: "title", description: "title attribute of the option", type: "string", default: "-" },
            { property: "className", description: "The additional class to option", type: "string", default: "-" },
            { property: "children", description: "Option label", type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "SelectOptGroup",
          rows: [
            { property: "label", description: "Group label", type: "ReactNode", default: "-" },
            { property: "children", description: "SelectOption elements", type: "ReactNode", default: "-" },
          ],
        },
        {
          title: "Building blocks",
          description: "Also exported for composing your own pickers: SelectTrigger (the Input-looking box), SelectPopup (KKUI popover anchored to the trigger), SelectMenu (flat option list), SelectTag (chip), SelectEmpty (\"No data\").",
          rows: [
            { property: "SelectTrigger", description: "size / variant / status / disabled / open / multiple / prefix / suffixIcon / loading / showClear / onClear / searchable", type: "component", default: "-" },
            { property: "SelectPopup", description: "open / onOpenChange / anchor / anchorRef / placement / popupMatchSelectWidth", type: "component", default: "-" },
            { property: "SelectMenu", description: "items (FlatOption[]) / selected / active / onActive / onSelect / multiple / listHeight / notFoundContent / optionRender", type: "component", default: "-" },
          ],
        },
      ]}
      extra={
        <>
          <h2>FAQ</h2>
          <h3>The dropdown is closed when I click on an input inside popupRender</h3>
          <p>
            Focus can move into focusable elements inside the popup. Stop keyboard events with <code>onKeyDown={"{(e) => e.stopPropagation()}"}</code> on that
            input so the Select does not handle them.
          </p>
          <h3>Why does the placeholder not show after clearing in controlled mode?</h3>
          <p>
            Set the controlled <code>value</code> to <code>undefined</code> (or <code>null</code>) — an empty string is a valid value.
          </p>
        </>
      }
      related={[
        { title: "AutoComplete", path: "/components/auto-complete" },
        { title: "TreeSelect", path: "/components/tree-select" },
        { title: "Cascader", path: "/components/cascader" },
      ]}
    />
  );
}
