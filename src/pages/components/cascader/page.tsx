import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import DefaultValue from "./demos/default-value";
import defaultValueCode from "./demos/default-value.tsx?raw";
import Hover from "./demos/hover";
import hoverCode from "./demos/hover.tsx?raw";
import DisabledOption from "./demos/disabled-option";
import disabledOptionCode from "./demos/disabled-option.tsx?raw";
import ChangeOnSelect from "./demos/change-on-select";
import changeOnSelectCode from "./demos/change-on-select.tsx?raw";
import CustomTrigger from "./demos/custom-trigger";
import customTriggerCode from "./demos/custom-trigger.tsx?raw";
import CustomFieldNames from "./demos/custom-field-names";
import customFieldNamesCode from "./demos/custom-field-names.tsx?raw";
import Lazy from "./demos/lazy";
import lazyCode from "./demos/lazy.tsx?raw";
import CustomRender from "./demos/custom-render";
import customRenderCode from "./demos/custom-render.tsx?raw";
import Search from "./demos/search";
import searchCode from "./demos/search.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Multiple from "./demos/multiple";
import multipleCode from "./demos/multiple.tsx?raw";
import ShowCheckedStrategy from "./demos/show-checked-strategy";
import showCheckedStrategyCode from "./demos/show-checked-strategy.tsx?raw";
import Suffix from "./demos/suffix";
import suffixCode from "./demos/suffix.tsx?raw";
import Panel from "./demos/panel";
import panelCode from "./demos/panel.tsx?raw";
import Status from "./demos/status";
import statusCode from "./demos/status.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import Placement from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="cascader"
      imports={["Cascader", "CascaderPanel"]}
      whenToUse={tr(
        <ul>
          <li>เมื่อต้องเลือกจากข้อมูลที่สัมพันธ์กันเป็นลำดับชั้น เช่น จังหวัด/อำเภอ/ตำบล ระดับหน่วยงาน หรือหมวดหมู่สินค้า</li>
          <li>เมื่อข้อมูลมีจำนวนมาก แล้วซอยเป็นหลายชั้นเพื่อให้เลือกได้ง่ายขึ้น</li>
          <li>เลือกได้ครบทุกชั้นจบใน popup เดียว ไม่ต้องสลับหน้าไปมา</li>
        </ul>,
        <ul>
          <li>When you need to select from a set of associated data set. Such as province/city/district, company level, things classification.</li>
          <li>When selecting from a large data set, with multi-stage classification separated for easy selection.</li>
          <li>Chooses cascade items in one float layer for better user experience.</li>
        </ul>,
      )}
      demos={[
        { title: "Basic", description: "Cascade selection box for selecting among associated data set — the value is the whole path.", code: basicCode, component: <Basic /> },
        { title: "Default value", description: <>Specifies default value by an array: <code>defaultValue</code>.</>, code: defaultValueCode, component: <DefaultValue /> },
        { title: "Hover", description: <>Hover to expand sub menu with <code>expandTrigger="hover"</code>, click to select an option (leaf only).</>, code: hoverCode, component: <Hover /> },
        { title: "Disabled option", description: <>Disable an option by specifying the <code>disabled</code> property in options.</>, code: disabledOptionCode, component: <DisabledOption /> },
        { title: "Change on select", description: <>Allow only selecting the parent options: with <code>changeOnSelect</code> a click on any level changes the value.</>, code: changeOnSelectCode, component: <ChangeOnSelect /> },
        { title: "Custom trigger", description: "Separate the trigger from the result: pass any element as children.", code: customTriggerCode, component: <CustomTrigger /> },
        { title: "Custom field names", description: <>Custom field names with <code>fieldNames</code>.</>, code: customFieldNamesCode, component: <CustomFieldNames /> },
        { title: "Load Options Lazily", description: <>Load options lazily with <code>loadData</code>. Mark dynamic branches with <code>isLeaf: false</code>. Note: <code>loadData</code> does not work with <code>showSearch</code>.</>, code: lazyCode, component: <Lazy /> },
        { title: "Custom render", description: <>Customize the rendered value with <code>displayRender</code> — e.g. link the last item.</>, code: customRenderCode, component: <CustomRender /> },
        { title: "Search", description: <>Search and select options directly: paths are flattened to <code>A / B / C</code> and the matched text is highlighted.</>, code: searchCode, component: <Search /> },
        { title: "Size", description: <>Cascade selection box of different sizes: <code>lg</code>, <code>md</code>, <code>sm</code>.</>, code: sizeCode, component: <Size /> },
        { title: "Multiple", description: <>Select multiple options with <code>multiple</code> — checkboxes propagate between parents and children. Disabled options are skipped.</>, code: multipleCode, component: <Multiple /> },
        { title: "ShowCheckedStrategy", description: <>The way to show selected items in the box with <code>showCheckedStrategy</code>: <code>SHOW_CHILD</code> shows leaves, <code>SHOW_PARENT</code> collapses to the checked parent.</>, code: showCheckedStrategyCode, component: <ShowCheckedStrategy /> },
        { title: "Prefix and Suffix", description: <>Custom <code>prefix</code> and <code>suffixIcon</code>.</>, code: suffixCode, component: <Suffix /> },
        { title: "Panel", description: <>Use <code>CascaderPanel</code> directly — the columns without a popup, single or multiple.</>, code: panelCode, component: <Panel /> },
        { title: "Status", description: <>Add <code>status</code> to Cascader with <code>error</code> or <code>warning</code>.</>, code: statusCode, component: <Status /> },
        { title: "Variants", description: <>Variants of Cascader: <code>outlined</code>, <code>filled</code>, <code>borderless</code>, <code>underlined</code>.</>, code: variantCode, component: <Variant /> },
        { title: "Placement", description: <>You can manually specify the position of the popup via <code>placement</code>.</>, code: placementCode, component: <Placement /> },
      ]}
      api={[
        {
          title: "Cascader",
          rows: [
            { property: "allowClear", description: "Show clear button", type: "boolean | { clearIcon?: ReactNode }", default: "false" },
            { property: "autoClearSearchValue", description: "Whether the current search will be cleared on selecting an item (multiple)", type: "boolean", default: "true" },
            { property: "autoFocus", description: "If get focus when component mounted", type: "boolean", default: "false" },
            { property: "changeOnSelect", description: "(Single mode only) Change value on each selection if this prop is set", type: "boolean", default: "false" },
            { property: "children", description: "Custom trigger element (replaces the Select-style box)", type: "ReactElement", default: "-" },
            { property: "defaultValue", description: "Initial selected value", type: "string[] | number[] (multiple: string[][])", default: "[]" },
            { property: "disabled", description: "Whether disabled select", type: "boolean", default: "false" },
            { property: "displayRender", description: "The render function of displaying selected options", type: "(labels, selectedOptions) => ReactNode", default: "labels => labels.join(' / ')" },
            { property: "expandIcon", description: "Customize the current item expand icon", type: "ReactNode", default: "<ChevronRight />" },
            { property: "expandTrigger", description: "Expand current item when click or hover", type: "click | hover", default: "click" },
            { property: "fieldNames", description: "Custom field name for label, value and children", type: "{ label, value, children }", default: "{ label: 'label', value: 'value', children: 'children' }" },
            { property: "loadData", description: "To load option lazily. Does not work with showSearch", type: "(selectedOptions) => void", default: "-" },
            { property: "loading", description: "Indicate loading state", type: "boolean", default: "false" },
            { property: "maxTagCount", description: "Max tag count to show; responsive collapses tags that do not fit", type: "number | 'responsive'", default: "-" },
            { property: "maxTagPlaceholder", description: "Placeholder for not showing tags", type: "ReactNode | (omittedValues) => ReactNode", default: "-" },
            { property: "multiple", description: "Support multiple or not", type: "boolean", default: "false" },
            { property: "notFoundContent", description: "Specify content to show when no result matches", type: "ReactNode", default: "Not Found" },
            { property: "open", description: "Set visible of cascader popup", type: "boolean", default: "-" },
            { property: "optionRender", description: "Customize the rendering options", type: "(option) => ReactNode", default: "-" },
            { property: "options", description: "The data options of cascade ({ value, label, children, disabled, isLeaf })", type: "CascaderOption[]", default: "-" },
            { property: "placeholder", description: "The input placeholder", type: "string", default: "-" },
            { property: "placement", description: "Use preset popup align config from builtinPlacements", type: "bottomLeft | bottomRight | topLeft | topRight", default: "bottomLeft" },
            { property: "popupClassName", description: "The additional className of popup overlay", type: "string", default: "-" },
            { property: "popupMatchSelectWidth", description: "Whether the popup matches the trigger width; number = fixed width", type: "boolean | number", default: "false" },
            { property: "popupRender", description: "Customize dropdown content", type: "(menu: ReactElement) => ReactNode", default: "-" },
            { property: "popupStyle", description: "The additional style of popup overlay", type: "CSSProperties", default: "-" },
            { property: "prefix", description: "The custom prefix", type: "ReactNode", default: "-" },
            { property: "showCheckedStrategy", description: "The way to show selected items in box (multiple)", type: "SHOW_PARENT | SHOW_CHILD", default: "SHOW_CHILD" },
            { property: "showSearch", description: "Whether shows search input in single mode; object = { filter, render, sort, limit, matchInputWidth }", type: "boolean | CascaderShowSearchConfig", default: "false" },
            { property: "size", description: "The input size", type: "sm | md | lg", default: "md" },
            { property: "status", description: "Set validation status", type: "error | warning", default: "-" },
            { property: "suffixIcon", description: "The custom suffix icon", type: "ReactNode", default: "<ChevronDown />" },
            { property: "tagRender", description: "Customize tag render when multiple", type: "(props) => ReactNode", default: "-" },
            { property: "value", description: "The selected value (a path; multiple: an array of paths)", type: "string[] | number[] (multiple: string[][])", default: "-" },
            { property: "variant", description: "Variants of selector", type: "outlined | borderless | filled | underlined", default: "outlined" },
            { property: "onChange", description: "Callback when finishing cascader select", type: "(value, selectedOptions) => void", default: "-" },
            { property: "onOpenChange", description: "Callback when popup shown or hidden", type: "(open: boolean) => void", default: "-" },
            { property: "onSearch", description: "Callback when input changed", type: "(search: string) => void", default: "-" },
            { property: "onClear", description: "Called when clear", type: "() => void", default: "-" },
          ],
        },
        {
          title: "CascaderShowSearchConfig",
          description: "Object form of `showSearch`.",
          rows: [
            { property: "filter", description: "The function will receive two arguments, inputValue and option; if the function returns true, the option will be included in the filtered set", type: "(inputValue, path) => boolean", default: "-" },
            { property: "limit", description: "Set the count of filtered items; false removes the limit", type: "number | false", default: "50" },
            { property: "matchInputWidth", description: "Whether the width of list matches input", type: "boolean", default: "true" },
            { property: "render", description: "Used to render filtered options", type: "(inputValue, path) => ReactNode", default: "-" },
            { property: "sort", description: "Used to sort filtered options", type: "(a, b, inputValue) => number", default: "-" },
          ],
        },
        {
          title: "CascaderPanel",
          description: "The columns without a popup — same data props as Cascader.",
          rows: [
            { property: "options", description: "The data options of cascade", type: "CascaderOption[]", default: "-" },
            { property: "value / defaultValue / onChange", description: "Same as Cascader", type: "-", default: "-" },
            { property: "multiple", description: "Support multiple or not", type: "boolean", default: "false" },
            { property: "changeOnSelect", description: "Change value on each selection (single)", type: "boolean", default: "false" },
            { property: "expandTrigger", description: "Expand current item when click or hover", type: "click | hover", default: "click" },
            { property: "loadData", description: "To load option lazily", type: "(selectedOptions) => void", default: "-" },
            { property: "disabled", description: "Whether disabled", type: "boolean", default: "false" },
          ],
        },
      ]}
      extra={
        <>
          <h2>FAQ</h2>
          <h3>Why does the popup collapse after selecting in multiple mode?</h3>
          <p>It does not — multiple mode keeps the popup open so several paths can be checked; click outside or press Escape to close.</p>
          <h3>When to use changeOnSelect?</h3>
          <p>When every level is a meaningful value on its own (e.g. region pickers where a province alone is valid).</p>
        </>
      }
      related={[
        { title: "Select", path: "/components/select" },
        { title: "TreeSelect", path: "/components/tree-select" },
      ]}
    />
  );
}
