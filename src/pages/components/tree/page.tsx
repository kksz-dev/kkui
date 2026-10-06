import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Controlled from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import Draggable from "./demos/draggable";
import draggableCode from "./demos/draggable.tsx?raw";
import AsyncLoad from "./demos/async";
import asyncLoadCode from "./demos/async.tsx?raw";
import Searchable from "./demos/searchable";
import searchableCode from "./demos/searchable.tsx?raw";
import Line from "./demos/line";
import lineCode from "./demos/line.tsx?raw";
import CustomIcon from "./demos/custom-icon";
import customIconCode from "./demos/custom-icon.tsx?raw";
import Directory from "./demos/directory";
import directoryCode from "./demos/directory.tsx?raw";
import BlockNode from "./demos/block-node";
import blockNodeCode from "./demos/block-node.tsx?raw";
import SwitcherIcon from "./demos/switcher-icon";
import switcherIconCode from "./demos/switcher-icon.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import CheckStrictly from "./demos/check-strictly";
import checkStrictlyCode from "./demos/check-strictly.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="tree"
      imports={["Tree", "TreeDirectoryTree", "type DataNode"]}
      whenToUse={tr(
        <>
          <ul>
            <li>ใช้โครงสร้าง Tree แทนข้อมูลได้หลายแบบ เช่น ไดเรกทอรี ลำดับชั้นองค์กร การจำแนกประเภท ประเทศ และระบบดัชนี</li>
            <li>Tree ให้ผู้ใช้ขยาย ยุบ เลือก ทำเครื่องหมาย และลาก node ภายในมุมมองแบบลำดับชั้น</li>
          </ul>
        </>,
        <>
        <ul>
          <li>Almost anything can be represented in a tree structure: directories, organization hierarchies, biological classifications, countries, and index systems.</li>
          <li>The Tree component allows users to expand, collapse, select, check, and drag tree nodes in a hierarchical view.</li>
        </ul>
        </>,
      )}
      demos={[
        { title: tr("พื้นฐาน", "Basic"), description: tr("การใช้งานพื้นฐาน พร้อม node ที่เลือกและทำเครื่องหมายได้", "The most basic usage, with selectable and checkable nodes."), code: basicCode, component: <Basic /> },
        { title: tr("แบบ controlled", "Controlled"), description: tr("ควบคุม expandedKeys, checkedKeys และ selectedKeys จากภายนอก", "Controlled expandedKeys, checkedKeys, and selectedKeys."), code: controlledCode, component: <Controlled /> },
        { title: tr("ลากวาง", "Draggable"), description: tr("ลากวาง tree node เพื่อเรียงลำดับหรือย้าย parent", "Drag and drop tree nodes to reorder or re-parent them."), code: draggableCode, component: <Draggable /> },
        { title: tr("โหลดข้อมูลแบบ asynchronous", "Load Data Asynchronously"), description: tr("โหลดข้อมูลแบบ asynchronous เมื่อขยาย node", "To load data asynchronously when node expands."), code: asyncLoadCode, component: <AsyncLoad /> },
        { title: tr("ค้นหา", "Searchable"), description: tr("ค้นหาและกรอง node พร้อมขยายรายการให้อัตโนมัติ", "Search and filter nodes with auto expanding."), code: searchableCode, component: <Searchable /> },
        { title: tr("แสดงเส้นลำดับชั้น", "Tree With Line"), description: tr("เชื่อมแต่ละระดับของ node ด้วยเส้นลำดับชั้น", "Connect node levels with hierarchy lines."), code: lineCode, component: <Line /> },
        { title: tr("กำหนดไอคอน", "Customized Icon"), description: tr("กำหนดไอคอนแยกสำหรับแต่ละ node", "Customize icons for individual nodes."), code: customIconCode, component: <CustomIcon /> },
        { title: tr("Directory Tree", "Directory Tree"), description: tr("Tree ของโฟลเดอร์และไฟล์ พร้อม highlight เต็มแถว", "Folder and file tree with block highlight style."), code: directoryCode, component: <Directory /> },
        { title: tr("Node เต็มแถว", "Block Node"), description: tr("ให้ tree node กว้างเต็มแถว", "Tree nodes take the full width of row."), code: blockNodeCode, component: <BlockNode /> },
        { title: tr("กำหนด Switcher Icon", "Custom Switcher Icon"), description: tr("กำหนดไอคอนสำหรับขยายและยุบ", "Customize the expand/collapse switcher icon."), code: switcherIconCode, component: <SwitcherIcon /> },
        { title: tr("ปิดใช้งาน Node", "Disabled Nodes"), description: tr("ปิดการเลือกหรือ Checkbox เฉพาะบาง node", "Disable selection or checkbox for specific nodes."), code: disabledCode, component: <Disabled /> },
        { title: tr("เลือกแบบอิสระ", "Check Strictly"), description: tr("การเลือก Checkbox ของ parent และ children เป็นอิสระต่อกัน", "Checkbox selection is strictly independent between parent and children."), code: checkStrictlyCode, component: <CheckStrictly /> },
      ]}
      api={[
        {
          title: "Tree",
          rows: [
            { property: "treeData", description: "Data array of the tree", type: "DataNode[]", default: "[]" },
            { property: "checkable", description: "Add a Checkbox before the tree nodes", type: "boolean", default: "false" },
            { property: "checkedKeys", description: "Controlled checked keys", type: "Key[] | { checked: Key[]; halfChecked: Key[] }", default: "[]" },
            { property: "defaultCheckedKeys", description: "Default checked keys", type: "Key[]", default: "[]" },
            { property: "checkStrictly", description: "Check treeNode precisely; parent and child treeNodes are not associated", type: "boolean", default: "false" },
            { property: "selectedKeys", description: "Controlled selected keys", type: "Key[]", default: "[]" },
            { property: "defaultSelectedKeys", description: "Default selected keys", type: "Key[]", default: "[]" },
            { property: "multiple", description: "Whether to allow selecting multiple treeNodes", type: "boolean", default: "false" },
            { property: "expandedKeys", description: "Controlled expanded keys", type: "Key[]", default: "[]" },
            { property: "defaultExpandedKeys", description: "Default expanded keys", type: "Key[]", default: "[]" },
            { property: "defaultExpandAll", description: "Whether to expand all treeNodes by default", type: "boolean", default: "false" },
            { property: "autoExpandParent", description: "Whether to automatically expand parent nodes", type: "boolean", default: "false" },
            { property: "showLine", description: "Show hierarchy connecting lines", type: "boolean | { showLeafIcon?: boolean }", default: "false" },
            { property: "showIcon", description: "Show node icons", type: "boolean", default: "false" },
            { property: "switcherIcon", description: "Custom switcher icon", type: "ReactNode | ((props) => ReactNode)", default: "-" },
            { property: "blockNode", description: "Whether treeNode fill remaining horizontal space", type: "boolean", default: "false" },
            { property: "draggable", description: "Specifies whether this tree or node is draggable", type: "boolean", default: "false" },
            { property: "loadData", description: "Load data asynchronously", type: "(node: DataNode) => Promise<void>", default: "-" },
            { property: "filterTreeNode", description: "Highlight search matching tree nodes", type: "(node: DataNode) => boolean", default: "-" },
            { property: "titleRender", description: "Custom title render function", type: "(node: DataNode) => ReactNode", default: "-" },
            { property: "onCheck", description: "Callback when checkbox is checked/unchecked", type: "(checkedKeys, info) => void", default: "-" },
            { property: "onSelect", description: "Callback when node is selected", type: "(selectedKeys, info) => void", default: "-" },
            { property: "onExpand", description: "Callback when node is expanded/collapsed", type: "(expandedKeys, info) => void", default: "-" },
            { property: "onDrop", description: "Callback when dragging node is dropped", type: "(info) => void", default: "-" },
          ],
        },
        {
          title: "TreeDirectoryTree",
          description: "Special directory style tree with folder/file icons and block selection.",
          rows: [
            { property: "expandAction", description: "Directory tree expand trigger", type: "false | 'click' | 'doubleClick'", default: "'click'" },
            { property: "multiple", description: "Support multi-selection with Ctrl/Cmd key", type: "boolean", default: "false" },
          ],
        },
        {
          title: "DataNode",
          description: "Structure of each node in treeData.",
          rows: [
            { property: "key", description: "Unique key of the node", type: "string | number", default: "-" },
            { property: "title", description: "Title of the node", type: "ReactNode | ((data) => ReactNode)", default: "-" },
            { property: "children", description: "Children node list", type: "DataNode[]", default: "-" },
            { property: "disabled", description: "Disable the node", type: "boolean", default: "false" },
            { property: "disableCheckbox", description: "Disable checkbox of the node", type: "boolean", default: "false" },
            { property: "selectable", description: "Set whether node is selectable", type: "boolean", default: "true" },
            { property: "isLeaf", description: "Determines if this is a leaf node", type: "boolean", default: "false" },
            { property: "icon", description: "Custom icon for this node", type: "ReactNode | ((props) => ReactNode)", default: "-" },
            { property: "switcherIcon", description: "Custom switcher icon for this node", type: "ReactNode | ((props) => ReactNode)", default: "-" },
          ],
        },
      ]}
    />
  );
}
