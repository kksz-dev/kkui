import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Layout from "./demos/layout";
import layoutCode from "./demos/layout.tsx?raw";
import Size from "./demos/size";
import sizeCode from "./demos/size.tsx?raw";
import Disabled from "./demos/disabled";
import disabledCode from "./demos/disabled.tsx?raw";
import Variant from "./demos/variant";
import variantCode from "./demos/variant.tsx?raw";
import RequiredMark from "./demos/required-mark";
import requiredMarkCode from "./demos/required-mark.tsx?raw";
import LayoutLabelCol from "./demos/layout-labelcol";
import layoutLabelColCode from "./demos/layout-labelcol.tsx?raw";
import ControlHooks from "./demos/control-hooks";
import controlHooksCode from "./demos/control-hooks.tsx?raw";
import Dependencies from "./demos/dependencies";
import dependenciesCode from "./demos/dependencies.tsx?raw";
import UseWatch from "./demos/use-watch";
import useWatchCode from "./demos/use-watch.tsx?raw";
import DynamicFormItem from "./demos/dynamic-form-item";
import dynamicFormItemCode from "./demos/dynamic-form-item.tsx?raw";
import DynamicRules from "./demos/dynamic-rules";
import dynamicRulesCode from "./demos/dynamic-rules.tsx?raw";
import NestMessages from "./demos/nest-messages";
import nestMessagesCode from "./demos/nest-messages.tsx?raw";
import CustomizedFormControls from "./demos/customized-form-controls";
import customizedFormControlsCode from "./demos/customized-form-controls.tsx?raw";
import ValidateStatic from "./demos/validate-static";
import validateStaticCode from "./demos/validate-static.tsx?raw";
import InlineLogin from "./demos/inline-login";
import inlineLoginCode from "./demos/inline-login.tsx?raw";
import Register from "./demos/register";
import registerCode from "./demos/register.tsx?raw";
import AdvancedSearch from "./demos/advanced-search";
import advancedSearchCode from "./demos/advanced-search.tsx?raw";
import FormInModal from "./demos/form-in-modal";
import formInModalCode from "./demos/form-in-modal.tsx?raw";
import TimeRelatedControls from "./demos/time-related-controls";
import timeRelatedControlsCode from "./demos/time-related-controls.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="form"
      imports={["Form", "FormItem", "FormList", "FormErrorList", "FormProvider", "useForm", "useWatch"]}
      whenToUse={tr(
        <>
          <p>
            ใช้เมื่อต้องรับข้อมูลจากผู้ใช้ ตรวจสอบความถูกต้อง แล้วส่งออกไป — ฟอร์มเก็บค่าไว้ใน store ของตัวเอง ไม่ต้องทำ{" "}
            <code>useState</code> ทีละช่อง
          </p>
          <ul>
            <li>
              <code>Form.useForm()</code> คืน instance จริงที่สั่งงานได้ทันที (<code>setFieldsValue</code>,{" "}
              <code>resetFields</code>, <code>validateFields</code>, <code>submit</code>)
            </li>
            <li>
              <code>Form.Item</code> จับคู่ค่ากับ control ที่มี <code>value</code>/<code>onChange</code> ให้อัตโนมัติ —
              ปรับด้วย <code>valuePropName</code>, <code>trigger</code>, <code>getValueFromEvent</code>
            </li>
            <li>
              ชื่อฟิลด์ซ้อนกันได้ (<code>name={`{["user", "email"]}`}</code>) และทำรายการแบบไดนามิกด้วย{" "}
              <code>Form.List</code>
            </li>
            <li>
              เฝ้าค่าเฉพาะที่สนใจด้วย <code>Form.useWatch</code> เพื่อไม่ให้ทั้งฟอร์ม re-render
            </li>
          </ul>
          <p className="mt-2">
            ถ้าต้องการแค่ layout ของ input เดี่ยว ๆ ให้ใช้ control ตรง ๆ ไม่ต้องห่อด้วย Form
          </p>
        </>,
        <>
          <p>
            Use a form to collect, validate and submit user input — values live in the form store, so you do not need a{" "}
            <code>useState</code> per field.
          </p>
          <ul>
            <li>
              <code>Form.useForm()</code> returns a live instance you can drive imperatively (<code>setFieldsValue</code>
              , <code>resetFields</code>, <code>validateFields</code>, <code>submit</code>).
            </li>
            <li>
              <code>Form.Item</code> wires the value into any control with <code>value</code>/<code>onChange</code> —
              adjust it with <code>valuePropName</code>, <code>trigger</code>, <code>getValueFromEvent</code>.
            </li>
            <li>
              Names can be nested (<code>name={`{["user", "email"]}`}</code>) and repeated with <code>Form.List</code>.
            </li>
            <li>
              Watch a single value with <code>Form.useWatch</code> instead of re-rendering the whole form.
            </li>
          </ul>
          <p className="mt-2">For a standalone input, use the control directly — no Form needed.</p>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic Usage"),
          description: tr(
            <>
              ฟอร์มมาตรฐาน: <code>initialValues</code>, กฎ <code>required</code>, ปุ่ม <code>htmlType="submit"</code> และ{" "}
              <code>onFinish</code> / <code>onFinishFailed</code>
            </>,
            <>
              A standard form: <code>initialValues</code>, <code>required</code> rules, an <code>htmlType="submit"</code>{" "}
              button and <code>onFinish</code> / <code>onFinishFailed</code>.
            </>,
          ),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("การจัดวาง", "Form Layout"),
          description: tr(
            <>
              <code>layout</code> มี 3 แบบ: <code>horizontal</code> (ค่าเริ่มต้น), <code>vertical</code>,{" "}
              <code>inline</code>
            </>,
            <>
              Three <code>layout</code>s: <code>horizontal</code> (default), <code>vertical</code> and{" "}
              <code>inline</code>.
            </>,
          ),
          code: layoutCode,
          component: <Layout />,
        },
        {
          title: tr("ขนาด", "Size"),
          description: tr(
            <>
              <code>size</code> ปรับทั้งป้ายกำกับ ระยะห่าง และส่งต่อให้ control ลูกที่รับ <code>size</code>
            </>,
            <>
              <code>size</code> scales labels and spacing, and is forwarded to every child control that accepts a{" "}
              <code>size</code>.
            </>,
          ),
          code: sizeCode,
          component: <Size />,
        },
        {
          title: tr("ปิดใช้งาน", "Disabled"),
          description: tr(
            <>
              <code>disabled</code> ที่ระดับฟอร์มปิดการใช้งาน control ทุกตัวในฟอร์ม
            </>,
            <>
              <code>disabled</code> on the form disables every control inside it.
            </>,
          ),
          code: disabledCode,
          component: <Disabled />,
        },
        {
          title: tr("รูปแบบช่องกรอก", "Variant"),
          description: tr(
            <>
              <code>variant</code> ส่งต่อให้ control ทุกตัว: <code>outlined</code> / <code>filled</code> /{" "}
              <code>borderless</code> / <code>underlined</code>
            </>,
            <>
              <code>variant</code> is forwarded to every control: <code>outlined</code> / <code>filled</code> /{" "}
              <code>borderless</code> / <code>underlined</code>.
            </>,
          ),
          code: variantCode,
          component: <Variant />,
        },
        {
          title: tr("เครื่องหมายบังคับกรอก", "Required Mark"),
          description: tr(
            <>
              <code>requiredMark</code> รับ <code>true</code>, <code>"optional"</code>, <code>false</code> หรือฟังก์ชัน
              render เอง
            </>,
            <>
              <code>requiredMark</code> takes <code>true</code>, <code>"optional"</code>, <code>false</code> or a render
              function.
            </>,
          ),
          code: requiredMarkCode,
          component: <RequiredMark />,
        },
        {
          title: tr("คอลัมน์ป้ายกำกับ", "Label Column"),
          description: tr(
            <>
              <code>labelCol</code> / <code>wrapperCol</code> แบ่งกริด 24 คอลัมน์ คู่กับ <code>labelAlign</code>,{" "}
              <code>labelWrap</code>, <code>colon</code> และตั้งเฉพาะบาง item ทับได้
            </>,
            <>
              <code>labelCol</code> / <code>wrapperCol</code> split a 24 column grid, together with{" "}
              <code>labelAlign</code>, <code>labelWrap</code> and <code>colon</code>. Any item may override them.
            </>,
          ),
          code: layoutLabelColCode,
          component: <LayoutLabelCol />,
        },
        {
          title: tr("สั่งงานฟอร์มด้วย hook", "Control Hooks"),
          description: tr(
            <>
              <code>Form.useForm()</code> ให้ instance สำหรับ <code>setFieldsValue</code>, <code>resetFields</code>,{" "}
              <code>getFieldValue</code>; ส่วน <code>shouldUpdate</code> ใช้แสดงฟิลด์ตามค่าที่เลือก
            </>,
            <>
              <code>Form.useForm()</code> hands you the instance for <code>setFieldsValue</code>,{" "}
              <code>resetFields</code> and <code>getFieldValue</code>; <code>shouldUpdate</code> reveals a field based on
              another value.
            </>,
          ),
          code: controlHooksCode,
          component: <ControlHooks />,
        },
        {
          title: tr("ฟิลด์ที่อ้างอิงกัน", "Dependencies"),
          description: tr(
            <>
              <code>dependencies</code> ตรวจซ้ำอัตโนมัติเมื่อฟิลด์ที่อ้างถึงเปลี่ยน และกฎแบบฟังก์ชันเข้าถึง instance ได้
            </>,
            <>
              <code>dependencies</code> re-validates when the field it points at changes; a function rule receives the
              form instance.
            </>,
          ),
          code: dependenciesCode,
          component: <Dependencies />,
        },
        {
          title: tr("เฝ้าค่า", "Use Watch"),
          description: tr(
            <>
              <code>Form.useWatch</code> รับชื่อฟิลด์หรือฟังก์ชันเลือกค่า และ re-render เฉพาะคอมโพเนนต์ที่เรียกใช้
            </>,
            <>
              <code>Form.useWatch</code> takes a field name or a selector, and only re-renders the component that calls
              it.
            </>,
          ),
          code: useWatchCode,
          component: <UseWatch />,
        },
        {
          title: tr("ฟิลด์แบบไดนามิก", "Dynamic Form Item"),
          description: tr(
            <>
              <code>Form.List</code> ให้ <code>fields</code> พร้อม <code>add</code> / <code>remove</code> /{" "}
              <code>move</code> และกฎระดับรายการที่แสดงผ่าน <code>Form.ErrorList</code>
            </>,
            <>
              <code>Form.List</code> gives you <code>fields</code> plus <code>add</code> / <code>remove</code> /{" "}
              <code>move</code>, and list level rules surfaced with <code>Form.ErrorList</code>.
            </>,
          ),
          code: dynamicFormItemCode,
          component: <DynamicFormItem />,
          full: true,
        },
        {
          title: tr("กฎแบบไดนามิก", "Dynamic Rules"),
          description: tr(
            <>กฎเป็นแค่พร็อพ เปลี่ยนได้ตาม state แล้วสั่ง <code>validateFields</code> ซ้ำ</>,
            <>
              Rules are plain props: change them from state, then re-run <code>validateFields</code>.
            </>,
          ),
          code: dynamicRulesCode,
          component: <DynamicRules />,
        },
        {
          title: tr("ข้อความตรวจสอบซ้อนกัน", "Nest Messages"),
          description: tr(
            <>
              <code>validateMessages</code> เป็นเทมเพลตกลางของทั้งฟอร์ม ใช้กับชื่อฟิลด์ซ้อน เช่น{" "}
              <code>{`["user", "email"]`}</code>
            </>,
            <>
              <code>validateMessages</code> holds the templates for the whole form, and works with nested names such as{" "}
              <code>{`["user", "email"]`}</code>.
            </>,
          ),
          code: nestMessagesCode,
          component: <NestMessages />,
        },
        {
          title: tr("คอนโทรลของตัวเอง", "Customized Form Controls"),
          description: tr(
            <>คอมโพเนนต์ใดก็ตามที่มี <code>value</code> และ <code>onChange</code> ใช้กับ Form.Item ได้ทันที</>,
            <>
              Any component with a <code>value</code> and an <code>onChange</code> works inside a Form.Item.
            </>,
          ),
          code: customizedFormControlsCode,
          component: <CustomizedFormControls />,
        },
        {
          title: tr("กำหนดสถานะเอง", "Validate Static"),
          description: tr(
            <>
              <code>validateStatus</code> + <code>help</code> + <code>hasFeedback</code> ครบทั้ง 4 สถานะ
              และเปลี่ยนไอคอนได้
            </>,
            <>
              <code>validateStatus</code> + <code>help</code> + <code>hasFeedback</code> across all four states, with
              replaceable icons.
            </>,
          ),
          code: validateStaticCode,
          component: <ValidateStatic />,
        },
        {
          title: tr("ล็อกอินแนวนอน", "Inline Login"),
          description: tr(
            <>
              ฟอร์ม <code>inline</code> ที่ปิดปุ่มไว้จนกว่าจะกรอกครบ ด้วย <code>shouldUpdate</code> +{" "}
              <code>getFieldsError</code>
            </>,
            <>
              An <code>inline</code> form whose button stays disabled until every field is valid, via{" "}
              <code>shouldUpdate</code> + <code>getFieldsError</code>.
            </>,
          ),
          code: inlineLoginCode,
          component: <InlineLogin />,
        },
        {
          title: tr("สมัครสมาชิก", "Registration"),
          description: tr(
            <>
              รวมกฎหลายแบบ: <code>type</code>, <code>pattern</code>, <code>whitespace</code>, validator แบบ async,{" "}
              <code>validateFirst</code>, <code>validateDebounce</code> และ <code>scrollToFirstError</code>
            </>,
            <>
              Everything at once: <code>type</code>, <code>pattern</code>, <code>whitespace</code>, async validators,{" "}
              <code>validateFirst</code>, <code>validateDebounce</code> and <code>scrollToFirstError</code>.
            </>,
          ),
          code: registerCode,
          component: <Register />,
        },
        {
          title: tr("ค้นหาขั้นสูง", "Advanced Search"),
          description: tr(
            <>วางฟิลด์ในกริดที่ย่อ/ขยายได้ ค่าที่ซ่อนไว้ยังอยู่ครบเพราะ <code>preserve</code> เปิดอยู่</>,
            <>
              Fields in a collapsible grid — hidden values survive because <code>preserve</code> is on by default.
            </>,
          ),
          code: advancedSearchCode,
          component: <AdvancedSearch />,
          full: true,
        },
        {
          title: tr("ฟอร์มใน Modal", "Form In Modal"),
          description: tr(
            <>
              <code>Form.Provider</code> ดักผลลัพธ์ของฟอร์มลูกผ่าน <code>onFormFinish</code> โดยไม่ต้องยก state ขึ้นมาเอง
            </>,
            <>
              <code>Form.Provider</code> catches a child form through <code>onFormFinish</code>, no lifted state needed.
            </>,
          ),
          code: formInModalCode,
          component: <FormInModal />,
        },
        {
          title: tr("ฟิลด์วันและเวลา", "Time Related Controls"),
          description: tr(
            <>
              DatePicker / RangePicker / TimePicker คืนค่าเป็น <code>Dayjs</code> ตรงเข้า store — จัดรูปแบบตอน{" "}
              <code>onFinish</code>
            </>,
            <>
              DatePicker / RangePicker / TimePicker put <code>Dayjs</code> values straight into the store — format them
              in <code>onFinish</code>.
            </>,
          ),
          code: timeRelatedControlsCode,
          component: <TimeRelatedControls />,
        },
      ]}
      api={[
        {
          title: "Form",
          description: tr(
            "ขยายจาก React.FormHTMLAttributes<HTMLFormElement> (ยกเว้น onSubmit ที่ถูกแทนด้วย onFinish)",
            "Extends React.FormHTMLAttributes<HTMLFormElement> (except onSubmit, replaced by onFinish).",
          ),
          rows: [
            { property: "form", description: tr("instance จาก Form.useForm()", "Instance from Form.useForm()"), type: "FormInstance", default: "-" },
            { property: "name", description: tr("ชื่อฟอร์ม ใช้เป็น prefix ของ id ฟิลด์ และเป็นคีย์ใน Form.Provider", "Form name — prefixes field ids and keys the form in Form.Provider"), type: "string", default: "-" },
            { property: "layout", description: tr("การจัดวางป้ายกำกับกับช่องกรอก", "How label and control are laid out"), type: "horizontal | vertical | inline", default: "horizontal" },
            { property: "size", description: tr("ขนาดของป้ายกำกับ/ระยะห่าง และส่งต่อให้ control ลูก", "Label + spacing scale, forwarded to child controls"), type: "sm | md | lg", default: "md" },
            { property: "variant", description: tr("รูปแบบช่องกรอกที่ส่งต่อให้ control ลูก", "Control style forwarded to child controls"), type: "outlined | filled | borderless | underlined", default: "-" },
            { property: "disabled", description: tr("ปิดการใช้งาน control ทุกตัวในฟอร์ม", "Disable every control in the form"), type: "boolean", default: "false" },
            { property: "labelCol", description: tr("คอลัมน์ของป้ายกำกับ (กริด 24)", "Label column on a 24 column grid"), type: "{ span?: number; offset?: number }", default: "-" },
            { property: "wrapperCol", description: tr("คอลัมน์ของช่องกรอก (กริด 24)", "Control column on a 24 column grid"), type: "{ span?: number; offset?: number }", default: "-" },
            { property: "labelAlign", description: tr("จัดชิดของข้อความป้ายกำกับ", "Text alignment of the label"), type: "left | right", default: "right" },
            { property: "labelWrap", description: tr("ให้ป้ายกำกับยาวขึ้นบรรทัดใหม่ได้", "Let a long label wrap"), type: "boolean", default: "false" },
            { property: "colon", description: tr("แสดง : ท้ายป้ายกำกับ (เฉพาะ horizontal)", "Show a colon after the label (horizontal only)"), type: "boolean", default: "true" },
            { property: "requiredMark", description: tr("รูปแบบเครื่องหมายบังคับกรอก", "How the required mark is rendered"), type: 'boolean | "optional" | (label, { required }) => ReactNode', default: "true" },
            { property: "scrollToFirstError", description: tr("เลื่อนไปฟิลด์แรกที่ผิดเมื่อ submit ไม่ผ่าน", "Scroll to the first failing field on submit"), type: "boolean | ScrollIntoViewOptions", default: "false" },
            { property: "validateMessages", description: tr("เทมเพลตข้อความของทั้งฟอร์ม รองรับ ${label} ${min} ${max} ${len} ${type} ${enum} ${pattern}", "Message templates for the whole form; supports ${label} ${min} ${max} ${len} ${type} ${enum} ${pattern}"), type: "ValidateMessages", default: "-" },
            { property: "validateTrigger", description: tr("อีเวนต์ที่เรียกการตรวจสอบ (ค่าเริ่มต้นของทุก item)", "Event(s) that run validation, inherited by every item"), type: "string | string[]", default: "onChange" },
            { property: "initialValues", description: tr("ค่าเริ่มต้น ใช้ตอน mount และตอน resetFields()", "Initial values, applied on mount and by resetFields()"), type: "object", default: "-" },
            { property: "preserve", description: tr("เก็บค่าของฟิลด์ที่ถูก unmount ไว้", "Keep values of unmounted fields"), type: "boolean", default: "true" },
            { property: "component", description: tr("อิลิเมนต์ที่ใช้เรนเดอร์; false = ไม่ห่อด้วยแท็กใดเลย", "Element to render; false renders no wrapper"), type: "false | string | ComponentType", default: "form" },
            { property: "feedbackIcons", description: tr("แทนไอคอนของ hasFeedback ทั้งฟอร์ม", "Replace the hasFeedback icons for the whole form"), type: "({ status, errors, warnings }) => Partial<Record<ValidateStatus, ReactNode>>", default: "-" },
            { property: "clearOnDestroy", description: tr("ล้าง store ทิ้งเมื่อฟอร์มถูก unmount", "Wipe the store when the form unmounts"), type: "boolean", default: "false" },
            { property: "onFinish", description: tr("ทำงานเมื่อ submit แล้วตรวจผ่านทุกฟิลด์", "Fires on submit when every field passes"), type: "(values) => void", default: "-" },
            { property: "onFinishFailed", description: tr("ทำงานเมื่อตรวจไม่ผ่าน ได้ errorFields ที่คำนวณสด", "Fires when validation fails, with freshly computed errorFields"), type: "({ values, errorFields, outOfDate }) => void", default: "-" },
            { property: "onValuesChange", description: tr("ค่าใดค่าหนึ่งเปลี่ยน", "A value changed"), type: "(changedValues, allValues) => void", default: "-" },
            { property: "onFieldsChange", description: tr("ค่า/สถานะของฟิลด์เปลี่ยน", "A field's value or meta changed"), type: "(changedFields, allFields) => void", default: "-" },
          ],
        },
        {
          title: "Form.Item",
          rows: [
            { property: "name", description: tr("ชื่อฟิลด์ ซ้อนได้ด้วยอาร์เรย์; ไม่ใส่ = เป็นแค่ layout", "Field name, nestable as an array; omit it for a layout-only item"), type: "string | number | (string | number)[]", default: "-" },
            { property: "label", description: tr("ป้ายกำกับ", "Label content"), type: "ReactNode", default: "-" },
            { property: "rules", description: tr("กฎการตรวจสอบ; เป็นฟังก์ชัน (form) => rule เพื่ออ้างฟิลด์อื่นก็ได้", "Validation rules; a rule may be a (form) => rule function"), type: "(FormRule | (form) => FormRule)[]", default: "-" },
            { property: "initialValue", description: tr("ค่าเริ่มต้นเฉพาะ item (ลำดับรองจาก initialValues ของฟอร์ม) ใช้ตอน resetFields ด้วย", "Item level initial value (lower priority than the form's), also honoured by resetFields"), type: "unknown", default: "-" },
            { property: "valuePropName", description: tr("ชื่อพร็อพที่รับค่า เช่น checked สำหรับ Checkbox/Switch", "Prop the value is written to, e.g. checked for Checkbox/Switch"), type: "string", default: "value" },
            { property: "trigger", description: tr("ชื่อพร็อพที่รายงานค่าที่เปลี่ยน", "Prop that reports a change"), type: "string", default: "onChange" },
            { property: "validateTrigger", description: tr("อีเวนต์ที่เรียกการตรวจสอบของ item นี้", "Event(s) that validate this item"), type: "string | string[]", default: tr("จากฟอร์ม", "from Form") },
            { property: "getValueFromEvent", description: tr("ดึงค่าออกจากอาร์กิวเมนต์ของ trigger", "Pull the value out of the trigger arguments"), type: "(...args) => unknown", default: "-" },
            { property: "getValueProps", description: tr("แปลงค่าเป็นพร็อพชุดใหม่ให้ child (แทน valuePropName)", "Turn the value into props for the child (replaces valuePropName)"), type: "(value) => Record<string, unknown>", default: "-" },
            { property: "normalize", description: tr("แปลงค่าก่อนเก็บลง store", "Normalise the value before it enters the store"), type: "(value, prevValue, allValues) => unknown", default: "-" },
            { property: "validateFirst", description: tr("หยุดที่กฎแรกที่ไม่ผ่าน; parallel = รันพร้อมกันแล้วเอาอันแรก", 'Stop at the first failing rule; "parallel" runs them together'), type: 'boolean | "parallel"', default: "false" },
            { property: "validateDebounce", description: tr("หน่วงการตรวจสอบจาก trigger (มิลลิวินาที)", "Debounce trigger based validation (ms)"), type: "number", default: "-" },
            { property: "messageVariables", description: tr("ตัวแปรเพิ่มสำหรับเทมเพลตข้อความ", "Extra variables for message templates"), type: "Record<string, string>", default: "-" },
            { property: "preserve", description: tr("เก็บค่าไว้เมื่อ item ถูก unmount", "Keep the value when the item unmounts"), type: "boolean", default: tr("จากฟอร์ม", "from Form") },
            { property: "dependencies", description: tr("ฟิลด์ที่อ้างถึง: เปลี่ยนแล้ว render ใหม่และตรวจซ้ำ", "Fields this one depends on: re-render and re-validate when they change"), type: "NamePath[]", default: "-" },
            { property: "shouldUpdate", description: tr("render ใหม่ทุกครั้งที่ค่าเปลี่ยน หรือเมื่อฟังก์ชันคืน true", "Re-render on every change, or when the function returns true"), type: "boolean | (prev, cur, { source }) => boolean", default: "false" },
            { property: "noStyle", description: tr("ไม่เรนเดอร์ป้ายกำกับ/ข้อความ — ข้อผิดพลาดจะไปโผล่ที่ item แม่", "Render only the control — errors bubble to the parent item"), type: "boolean", default: "false" },
            { property: "hidden", description: tr("ซ่อนแต่ยังลงทะเบียนฟิลด์อยู่", "Hide the item but keep the field registered"), type: "boolean", default: "false" },
            { property: "hasFeedback", description: tr("แสดงไอคอนสถานะข้างช่องกรอก", "Show a status icon next to the control"), type: "boolean | { icons: FeedbackIcons }", default: "false" },
            { property: "tooltip", description: tr("คำอธิบายเพิ่มข้างป้ายกำกับ", "Hint shown next to the label"), type: "ReactNode | { title: ReactNode; icon?: ReactNode }", default: "-" },
            { property: "colon", description: tr("แสดง : ท้ายป้ายกำกับของ item นี้", "Colon after this item's label"), type: "boolean", default: tr("จากฟอร์ม", "from Form") },
            { property: "labelCol", description: tr("คอลัมน์ป้ายกำกับเฉพาะ item นี้", "Label column for this item"), type: "{ span?: number; offset?: number }", default: tr("จากฟอร์ม", "from Form") },
            { property: "wrapperCol", description: tr("คอลัมน์ช่องกรอกเฉพาะ item นี้", "Control column for this item"), type: "{ span?: number; offset?: number }", default: tr("จากฟอร์ม", "from Form") },
            { property: "labelAlign", description: tr("จัดชิดป้ายกำกับเฉพาะ item นี้", "Label alignment for this item"), type: "left | right", default: tr("จากฟอร์ม", "from Form") },
            { property: "htmlFor", description: tr("ค่า for ของ label (ค่าเริ่มต้นคือ id ที่ฟอร์มสร้างให้)", "The label's for attribute (defaults to the generated control id)"), type: "string", default: "-" },
            { property: "extra", description: tr("คำอธิบายเพิ่มใต้ช่องกรอก", "Extra hint under the control"), type: "ReactNode", default: "-" },
            { property: "help", description: tr("ข้อความใต้ช่องกรอก ใช้แทนข้อความตรวจสอบอัตโนมัติ", "Message under the control, replacing the automatic one"), type: "ReactNode", default: "-" },
            { property: "required", description: tr("บังคับแสดงเครื่องหมายบังคับกรอก (ปกติอ่านจาก rules)", "Force the required mark (normally derived from rules)"), type: "boolean", default: "-" },
            { property: "validateStatus", description: tr("กำหนดสถานะเอง", "Set the status manually"), type: "success | warning | error | validating", default: "-" },
            { property: "children", description: tr("control หนึ่งตัว หรือฟังก์ชัน (form) => ReactNode", "One control, or a (form) => ReactNode function"), type: "ReactNode | (form) => ReactNode", default: "-" },
          ],
        },
        {
          title: "Form.List",
          description: tr(
            "รายการฟิลด์แบบเพิ่ม/ลบได้ — children เป็น render prop",
            "A repeatable group of fields — children is a render prop.",
          ),
          rows: [
            { property: "name", description: tr("ชื่อของอาร์เรย์ใน store", "Name of the array in the store"), type: "NamePath", default: "-" },
            { property: "initialValue", description: tr("ค่าเริ่มต้นของรายการ", "Initial array value"), type: "unknown[]", default: "-" },
            { property: "rules", description: tr("กฎที่ตรวจกับทั้งอาร์เรย์ (แสดงด้วย Form.ErrorList)", "Rules validated against the whole array (surface them with Form.ErrorList)"), type: "(FormRule | (form) => FormRule)[]", default: "-" },
            { property: "children", description: tr("(fields, { add, remove, move }, { errors, warnings }) => ReactNode", "(fields, { add, remove, move }, { errors, warnings }) => ReactNode"), type: "function", default: "-" },
            { property: "fields[].key", description: tr("คีย์คงที่สำหรับ React (ไม่เปลี่ยนตอนย้าย/ลบ)", "Stable React key, unaffected by insert / remove / move"), type: "number", default: "-" },
            { property: "fields[].name", description: tr("ดัชนีในอาร์เรย์ ใช้เป็น prefix ของ name ภายใน", "Index in the array, used as the name prefix of inner items"), type: "number", default: "-" },
            { property: "add", description: tr("เพิ่มรายการ (ระบุตำแหน่งได้)", "Append or insert an entry"), type: "(defaultValue?, insertIndex?) => void", default: "-" },
            { property: "remove", description: tr("ลบรายการเดียวหรือหลายรายการ", "Remove one or several entries"), type: "(index: number | number[]) => void", default: "-" },
            { property: "move", description: tr("ย้ายตำแหน่งรายการ", "Move an entry"), type: "(from: number, to: number) => void", default: "-" },
          ],
        },
        {
          title: "FormRule",
          description: tr(
            "กฎหนึ่งข้อใน rules — min/max เทียบตัวเลขเมื่อค่าเป็นตัวเลข ที่เหลือเทียบความยาว",
            "One entry of rules — min/max compare the number itself for numbers, otherwise the length.",
          ),
          rows: [
            { property: "required", description: tr("ห้ามว่าง (undefined, null, \"\", [])", 'Must not be empty (undefined, null, "", [])'), type: "boolean", default: "false" },
            { property: "message", description: tr("ข้อความเมื่อกฎนี้ไม่ผ่าน", "Message shown when this rule fails"), type: "ReactNode", default: tr("จากเทมเพลต", "from templates") },
            { property: "type", description: tr("ชนิดของค่าที่ต้องเป็น", "Type the value must have"), type: "string | number | boolean | array | date | email | url | regexp", default: "-" },
            { property: "pattern", description: tr("ต้องตรงกับ RegExp", "Must match the RegExp"), type: "RegExp", default: "-" },
            { property: "min", description: tr("ค่าต่ำสุด (ตัวเลข) หรือความยาวต่ำสุด", "Minimum number, or minimum length"), type: "number", default: "-" },
            { property: "max", description: tr("ค่าสูงสุด (ตัวเลข) หรือความยาวสูงสุด", "Maximum number, or maximum length"), type: "number", default: "-" },
            { property: "len", description: tr("ความยาว/ค่าที่ต้องเท่ากันพอดี", "Exact length or exact number"), type: "number", default: "-" },
            { property: "enum", description: tr("ต้องเป็นหนึ่งในค่าที่กำหนด", "Value must be one of these"), type: "unknown[]", default: "-" },
            { property: "whitespace", description: tr("สตริงที่มีแต่ช่องว่างถือว่าไม่ผ่าน", "A whitespace-only string fails"), type: "boolean", default: "false" },
            { property: "transform", description: tr("แปลงค่าก่อนตรวจ (ค่าที่เก็บไม่เปลี่ยน)", "Transform the value before validating (the store keeps the original)"), type: "(value) => unknown", default: "-" },
            { property: "validator", description: tr("ตรวจเอง; reject/throw = ไม่ผ่าน (async ได้)", "Custom check; reject or throw to fail (may be async)"), type: "(rule, value) => Promise<void> | void", default: "-" },
            { property: "warningOnly", description: tr("ไม่ผ่านแล้วเป็นแค่คำเตือน ไม่บล็อกการ submit", "Failure becomes a warning and does not block submit"), type: "boolean", default: "false" },
            { property: "validateTrigger", description: tr("ให้กฎนี้ทำงานเฉพาะบางอีเวนต์", "Only run this rule on these triggers"), type: "string | string[]", default: "-" },
          ],
        },
        {
          title: "FormInstance",
          description: tr("ค่าที่ได้จาก Form.useForm() / Form.useFormInstance()", "What Form.useForm() and Form.useFormInstance() return."),
          rows: [
            { property: "getFieldValue", description: tr("อ่านค่าฟิลด์เดียว", "Read one field value"), type: "(name: NamePath) => unknown", default: "-" },
            { property: "getFieldsValue", description: tr("อ่านค่าทั้งหมด หรือเฉพาะรายชื่อที่ระบุ", "Read all values, or only the listed ones"), type: "(nameList?: NamePath[] | true) => Values", default: "-" },
            { property: "setFieldValue", description: tr("ตั้งค่าฟิลด์เดียว", "Set one field value"), type: "(name: NamePath, value: unknown) => void", default: "-" },
            { property: "setFieldsValue", description: tr("ตั้งค่าหลายฟิลด์ (merge แบบลึก)", "Set several values (deep merge)"), type: "(values: Partial<Values>) => void", default: "-" },
            { property: "setFields", description: tr("ตั้งทั้งค่าและสถานะ (errors/warnings/touched/validating)", "Set values and meta (errors / warnings / touched / validating)"), type: "(fields: FieldData[]) => void", default: "-" },
            { property: "resetFields", description: tr("คืนค่าเริ่มต้นและล้างสถานะ", "Reset to the initial values and clear meta"), type: "(nameList?: NamePath[]) => void", default: "-" },
            { property: "validateFields", description: tr("ตรวจสอบ; สำเร็จคืนค่า ล้มเหลว reject ด้วย { values, errorFields, outOfDate }", "Validate; resolves with the values, rejects with { values, errorFields, outOfDate }"), type: "(nameList?: NamePath[]) => Promise<Values>", default: "-" },
            { property: "submit", description: tr("ตรวจสอบแล้วยิง onFinish / onFinishFailed", "Validate then fire onFinish / onFinishFailed"), type: "() => void", default: "-" },
            { property: "getFieldError", description: tr("ข้อผิดพลาดของฟิลด์", "Errors of one field"), type: "(name: NamePath) => ReactNode[]", default: "-" },
            { property: "getFieldWarning", description: tr("คำเตือนของฟิลด์ (จากกฎ warningOnly)", "Warnings of one field (from warningOnly rules)"), type: "(name: NamePath) => ReactNode[]", default: "-" },
            { property: "getFieldsError", description: tr("ข้อผิดพลาดของทุกฟิลด์ที่ลงทะเบียน", "Errors of every registered field"), type: "(nameList?: NamePath[]) => FieldError[]", default: "-" },
            { property: "isFieldTouched", description: tr("ฟิลด์ถูกแก้แล้วหรือยัง", "Has the field been edited"), type: "(name: NamePath) => boolean", default: "-" },
            { property: "isFieldsTouched", description: tr("มีฟิลด์ไหนถูกแก้ (หรือครบทุกฟิลด์เมื่อ allTouched = true)", "Any field edited, or all of them when allTouched is true"), type: "(nameList?: NamePath[] | boolean, allTouched?: boolean) => boolean", default: "-" },
            { property: "isFieldValidating", description: tr("ฟิลด์กำลังตรวจแบบ async อยู่", "Is the field running an async validation"), type: "(name: NamePath) => boolean", default: "-" },
            { property: "isFieldsValidating", description: tr("มีฟิลด์ใดกำลังตรวจอยู่", "Is any field validating"), type: "(nameList?: NamePath[]) => boolean", default: "-" },
            { property: "scrollToField", description: tr("เลื่อนหน้าจอไปที่ฟิลด์", "Scroll a field into view"), type: "(name: NamePath, options?: ScrollIntoViewOptions) => void", default: "-" },
          ],
        },
        {
          title: "Form.ErrorList / Form.Provider / hooks",
          rows: [
            { property: "Form.ErrorList", description: tr("แสดงรายการข้อผิดพลาด/คำเตือน (ใช้คู่กับกฎของ Form.List)", "Render a list of errors / warnings (pairs with Form.List rules)"), type: "{ errors?: ReactNode[]; warnings?: ReactNode[]; className?: string }", default: "-" },
            { property: "Form.Provider", description: tr("รวมหลายฟอร์มเข้าด้วยกัน: onFormChange / onFormFinish รับชื่อฟอร์มและ instance ทั้งหมด", "Group several forms: onFormChange / onFormFinish receive the form name and every instance"), type: "{ onFormChange?; onFormFinish?; children }", default: "-" },
            { property: "Form.useForm", description: tr("สร้าง instance ของฟอร์ม", "Create a form instance"), type: "() => [FormInstance]", default: "-" },
            { property: "Form.useFormInstance", description: tr("อ่าน instance ของฟอร์มที่ครอบอยู่", "Read the instance of the enclosing form"), type: "() => FormInstance", default: "-" },
            { property: "Form.useWatch", description: tr("เฝ้าค่าเดียวหรือค่าที่คำนวณจาก selector", "Watch one value, or a value derived by a selector"), type: "(dependency: NamePath | (values) => T, form?: FormInstance) => T", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>หมายเหตุ</h2>
          <h3>ค่าที่ถูกซ่อนหายไหม?</h3>
          <p>
            ไม่หาย — <code>preserve</code> เปิดอยู่โดยค่าเริ่มต้น ฟิลด์ที่ถูก unmount ยังเก็บค่าไว้ใน store ถ้าต้องการให้ลบทิ้ง
            ให้ตั้ง <code>preserve={`{false}`}</code> ที่ฟอร์มหรือที่ item
          </p>
          <h3>ทำไม min / max ของฉันเทียบความยาวไม่ใช่ตัวเลข?</h3>
          <p>
            เพราะค่าที่เก็บเป็นสตริง ถ้าต้องการเทียบตัวเลขให้ระบุ <code>{`{ type: "number", min: 0, max: 99 }`}</code> และใช้ InputNumber
          </p>
          <h3>ใช้ร่วมกับ control ของตัวเองอย่างไร</h3>
          <p>
            ขอแค่คอมโพเนนต์รับ <code>value</code> และเรียก <code>onChange</code> ก็พอ ถ้าชื่อพร็อพต่างออกไปให้ใช้{" "}
            <code>valuePropName</code>, <code>trigger</code>, <code>getValueFromEvent</code> หรือ <code>getValueProps</code>
          </p>
        </>,
        <>
          <h2>Notes</h2>
          <h3>Do hidden values disappear?</h3>
          <p>
            No — <code>preserve</code> is on by default, so an unmounted field keeps its value in the store. Set{" "}
            <code>preserve={`{false}`}</code> on the form or on the item to drop it instead.
          </p>
          <h3>Why do min / max check the length instead of the number?</h3>
          <p>
            Because the stored value is a string. Ask for a number explicitly with{" "}
            <code>{`{ type: "number", min: 0, max: 99 }`}</code> and pair it with an InputNumber.
          </p>
          <h3>How do I use my own control?</h3>
          <p>
            It only needs to accept a <code>value</code> and call <code>onChange</code>. When the prop names differ, map
            them with <code>valuePropName</code>, <code>trigger</code>, <code>getValueFromEvent</code> or{" "}
            <code>getValueProps</code>.
          </p>
        </>,
      )}
      related={[
        { title: "Input", path: "/components/input" },
        { title: "Select", path: "/components/select" },
        { title: "DatePicker", path: "/components/date-picker" },
      ]}
    />
  );
}
