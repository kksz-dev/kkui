import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Multiple from "./demos/multiple";
import multipleCode from "./demos/multiple.tsx?raw";
import Treedata from "./demos/treedata";
import treedataCode from "./demos/treedata.tsx?raw";
import Checkable from "./demos/checkable";
import checkableCode from "./demos/checkable.tsx?raw";
import Async from "./demos/async";
import asyncCode from "./demos/async.tsx?raw";
import TreeLine from "./demos/tree-line";
import treeLineCode from "./demos/tree-line.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import MaxCount from "./demos/max-count";
import maxCountCode from "./demos/max-count.tsx?raw";
import Suffix from "./demos/suffix";
import suffixCode from "./demos/suffix.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="tree-select"
      imports={["TreeSelect", "SHOW_ALL", "SHOW_PARENT", "SHOW_CHILD"]}
      whenToUse={tr(
        <p>
          <code>TreeSelect</code> คล้ายกับ <a href="/components/select">Select</a> แต่ตัวเลือกมาในรูปแบบโครงสร้างต้นไม้ เหมาะกับข้อมูลที่นิยามเป็นลำดับชั้น
          เช่น ผังหน่วยงาน ผังหมวดหมู่ หรือระบบไฟล์
        </p>,
        <p>
          <code>TreeSelect</code> is similar to <a href="/components/select">Select</a>, but the values are provided in a tree-like structure. Any data whose
          entries are defined in a hierarchical manner is fit to use this control — for example a department tree, a category tree or a file system.
        </p>,
      )}
      demos={[
        { title: tr("การใช้งานพื้นฐาน", "Basic"), description: tr("ใช้งานแบบพื้นฐานที่สุด: เลือกได้ค่าเดียว พร้อมค้นหาและล้างค่า", "The most basic usage: single selection with search and clear."), code: basicCode, component: <Basic /> },
        { title: tr("เลือกหลายค่า", "Multiple Selection"), description: tr(<>เลือกหลายค่าด้วย <code>multiple</code> คลิกที่ node เพื่อสลับสถานะ และแสดงค่าที่เลือกเป็น tag</>, <>Multiple selection with <code>multiple</code>; nodes toggle on click and show as tags.</>), code: multipleCode, component: <Multiple /> },
        { title: tr("สร้างจาก treeData", "Generate from tree data"), description: tr(<>สร้างโครงสร้างต้นไม้ผ่านพร็อพ <code>treeData</code> เป็นวิธีที่เร็วและง่ายที่สุดในการป้อนเนื้อหาของต้นไม้</>, <>The tree structure can be populated using <code>treeData</code> property. This is a quick and easy way to provide the tree content.</>), code: treedataCode, component: <Treedata /> },
        { title: tr("เลือกด้วย checkbox", "Checkable"), description: tr(<>เลือกหลายค่าแบบ checkbox ด้วย <code>treeCheckable</code> สถานะจะกระจายระหว่าง parent กับ child ส่วน <code>showCheckedStrategy</code> กำหนดว่าจะคืน key ชุดไหน</>, <>Multiple and checkable with <code>treeCheckable</code>; parents and children propagate. <code>showCheckedStrategy</code> decides which keys are reported.</>), code: checkableCode, component: <Checkable /> },
        { title: tr("โหลดข้อมูลแบบ asynchronous", "Asynchronous loading"), description: tr(<>โหลด node แบบ asynchronous ด้วย <code>loadData</code> ส่วนลิสต์ id / pId แบบ flat จะถูกประกอบเป็นลำดับชั้นผ่าน <code>treeDataSimpleMode</code></>, <>Asynchronous loading tree node via <code>loadData</code>; the flat id / pId list is nested through <code>treeDataSimpleMode</code>.</>), code: asyncCode, component: <Async /> },
        { title: tr("แสดงเส้นเชื่อม", "Show Tree Line"), description: tr(<>ใช้ <code>treeLine</code> เพื่อแสดงเส้นเชื่อม และ <code>treeIcon</code> เพื่อเรนเดอร์ไอคอนของแต่ละ node</>, <>Use <code>treeLine</code> to show the line style; <code>treeIcon</code> renders each node's icon.</>), code: treeLineCode, component: <TreeLine /> },
        { title: tr("ตำแหน่ง popup", "Placement"), description: tr(<>กำหนดตำแหน่งที่ popup เปิดออกมาได้เองผ่าน <code>placement</code></>, <>You can manually specify the position of the popup via <code>placement</code>.</>), code: placementCode, component: <Placement /> },
        { title: tr("สถานะ", "Status"), description: tr(<>ใส่ <code>status</code> เป็น <code>error</code> หรือ <code>warning</code> ให้ TreeSelect</>, <>Add <code>status</code> to TreeSelect with <code>error</code> or <code>warning</code>.</>), code: statusCode, component: <Status /> },
        { title: tr("รูปแบบ", "Variants"), description: tr(<>รูปแบบของ TreeSelect: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code></>, <>Variants of TreeSelect: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>), code: variantCode, component: <Variant /> },
        { title: tr("จำกัดจำนวนที่เลือก", "Max Count"), description: tr(<>จำกัดจำนวน node ที่เลือกได้ด้วย <code>maxCount</code></>, <>Limit the number of selected nodes with <code>maxCount</code>.</>), code: maxCountCode, component: <MaxCount /> },
        { title: tr("prefix และ suffix", "Prefix and Suffix"), description: tr(<>กำหนด <code>prefix</code> และ <code>suffixIcon</code> เองได้</>, <>Custom <code>prefix</code> and <code>suffixIcon</code>.</>), code: suffixCode, component: <Suffix /> },
      ]}
      api={[
        {
          title: "TreeSelect",
          rows: [
            { property: "allowClear", description: "Customize clear icon", type: "boolean | { clearIcon?: ReactNode }", default: "false" },
            { property: "autoClearSearchValue", description: "If auto clear search input value when multiple select is selected/deselected", type: "boolean", default: "true" },
            { property: "defaultOpen", description: "Initial open state of dropdown", type: "boolean", default: "-" },
            { property: "defaultValue", description: "To set the initial selected treeNode(s)", type: "string | string[]", default: "-" },
            { property: "disabled", description: "Disabled or not", type: "boolean", default: "false" },
            { property: "popupClassName", description: "The className of dropdown menu", type: "string", default: "-" },
            { property: "popupMatchSelectWidth", description: "Determine whether the popup menu and the select input are the same width. Default set min-width same as input", type: "boolean | number", default: "true" },
            { property: "popupRender", description: "Customize dropdown content", type: "(menu: ReactElement) => ReactNode", default: "-" },
            { property: "popupStyle", description: "To set the style of the dropdown menu", type: "CSSProperties", default: "-" },
            { property: "fieldNames", description: "Customize node label, value, children field name", type: "{ label, value, children }", default: "{ label: 'title', value: 'value', children: 'children' }" },
            { property: "filterTreeNode", description: "Whether to filter treeNodes by input value. The value of treeNodeFilterProp is used for filtering by default", type: "boolean | (inputValue, treeNode) => boolean", default: "true" },
            { property: "labelInValue", description: "Whether to embed label in value, turn the format of value from string to { value, label }", type: "boolean", default: "false" },
            { property: "listHeight", description: "Config popup height", type: "number", default: "256" },
            { property: "loadData", description: "Load data asynchronously", type: "(node) => Promise", default: "-" },
            { property: "loading", description: "Indicate loading state", type: "boolean", default: "false" },
            { property: "maxCount", description: "The max number of items can be selected", type: "number", default: "-" },
            { property: "maxTagCount", description: "Max tag count to show; responsive collapses tags that do not fit", type: "number | 'responsive'", default: "-" },
            { property: "maxTagPlaceholder", description: "Placeholder for not showing tags", type: "ReactNode | (omittedValues) => ReactNode", default: "-" },
            { property: "multiple", description: "Support multiple or not, will be true when enable treeCheckable", type: "boolean", default: "false" },
            { property: "notFoundContent", description: "Specify content to show when no result matches", type: "ReactNode", default: "Not Found" },
            { property: "open", description: "Controlled open state of dropdown", type: "boolean", default: "-" },
            { property: "placeholder", description: "Placeholder of the select input", type: "ReactNode", default: "-" },
            { property: "placement", description: "The position where the selection box pops up", type: "bottomLeft | bottomRight | topLeft | topRight", default: "bottomLeft" },
            { property: "prefix", description: "The custom prefix", type: "ReactNode", default: "-" },
            { property: "searchValue", description: "Work with onSearch to make search value controlled", type: "string", default: "-" },
            { property: "showCheckedStrategy", description: "The way show selected item in box when treeCheckable set. Default: just show child nodes. SHOW_ALL: show all checked treeNodes (include parent treeNode). SHOW_PARENT: show checked treeNodes (just show parent treeNode)", type: "SHOW_ALL | SHOW_PARENT | SHOW_CHILD", default: "SHOW_CHILD" },
            { property: "showSearch", description: "Support search or not", type: "boolean", default: "single: false, multiple: true" },
            { property: "size", description: "To set the size of the select input", type: "sm | md | lg", default: "md" },
            { property: "status", description: "Set validation status", type: "error | warning", default: "-" },
            { property: "suffixIcon", description: "The custom suffix icon", type: "ReactNode", default: "<ChevronDown />" },
            { property: "switcherIcon", description: "Customize collapse/expand icon of tree node", type: "ReactNode | ((props: { expanded }) => ReactNode)", default: "-" },
            { property: "tagRender", description: "Customize tag render when multiple", type: "(props) => ReactNode", default: "-" },
            { property: "treeCheckable", description: "Whether to show checkbox on the treeNodes", type: "boolean", default: "false" },
            { property: "treeCheckStrictly", description: "Whether to check nodes precisely (in the checkable mode), means parent and child nodes are not associated, and it will make labelInValue be true", type: "boolean", default: "false" },
            { property: "treeData", description: "Data of the treeNodes (title / value / children / disabled / disableCheckbox / selectable / isLeaf / icon)", type: "TreeSelectNode[]", default: "[]" },
            { property: "treeDataSimpleMode", description: "Enable simple mode of treeData. Changes the treeData schema to: [{ id, pId, value, title }]", type: "boolean | { id: string, pId: string, rootPId: string }", default: "false" },
            { property: "treeTitleRender", description: "Custom render nodes", type: "(node) => ReactNode", default: "-" },
            { property: "treeDefaultExpandAll", description: "Whether to expand all treeNodes by default", type: "boolean", default: "false" },
            { property: "treeDefaultExpandedKeys", description: "Default expanded treeNodes", type: "string[]", default: "-" },
            { property: "treeExpandAction", description: "Tree title expand logic", type: "false | click | doubleClick", default: "false" },
            { property: "treeExpandedKeys", description: "Set expanded keys", type: "string[]", default: "-" },
            { property: "treeIcon", description: "Shows the icon before a TreeNode's title", type: "boolean", default: "false" },
            { property: "treeLine", description: "Show the line", type: "boolean", default: "false" },
            { property: "treeNodeFilterProp", description: "Will be used for filtering if filterTreeNode returns true", type: "string", default: "value" },
            { property: "treeNodeLabelProp", description: "Will render as content of select", type: "string", default: "title" },
            { property: "value", description: "To set the current selected treeNode(s)", type: "string | string[]", default: "-" },
            { property: "variant", description: "Variants of selector", type: "outlined | borderless | filled | underlined", default: "outlined" },
            { property: "onChange", description: "A callback function, can be executed when selected treeNodes or input value change", type: "(value, label, extra) => void", default: "-" },
            { property: "onOpenChange", description: "Called when dropdown open", type: "(open: boolean) => void", default: "-" },
            { property: "onSearch", description: "A callback function, can be executed when the search input changes", type: "(value: string) => void", default: "-" },
            { property: "onSelect", description: "A callback function, can be executed when you select a treeNode", type: "(value, node) => void", default: "-" },
            { property: "onDeselect", description: "Called when a node is deselected / unchecked", type: "(value, node) => void", default: "-" },
            { property: "onTreeExpand", description: "A callback function, can be executed when treeNode expanded", type: "(expandedKeys) => void", default: "-" },
            { property: "onClear", description: "Called when clear", type: "() => void", default: "-" },
          ],
        },
        {
          title: "TreeSelectNode",
          rows: [
            { property: "checkable", description: "When Tree is checkable, set TreeNode display Checkbox or not", type: "boolean", default: "-" },
            { property: "disableCheckbox", description: "Disables the checkbox of the treeNode", type: "boolean", default: "false" },
            { property: "disabled", description: "Disabled or not", type: "boolean", default: "false" },
            { property: "isLeaf", description: "Leaf node or not", type: "boolean", default: "false" },
            { property: "key", description: "Fallback for value when it is missing", type: "string", default: "-" },
            { property: "selectable", description: "Whether can be selected", type: "boolean", default: "true" },
            { property: "title", description: "Content showed on the treeNodes", type: "ReactNode", default: "-" },
            { property: "value", description: "Will be treated as treeNodeFilterProp by default, should be unique in the tree", type: "string", default: "-" },
            { property: "icon", description: "Icon shown when treeIcon is set", type: "ReactNode", default: "-" },
            { property: "children", description: "Child nodes", type: "TreeSelectNode[]", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Select", path: "/components/select" },
        { title: "Cascader", path: "/components/cascader" },
        { title: "Tree", path: "/components/tree" },
      ]}
    />
  );
}
