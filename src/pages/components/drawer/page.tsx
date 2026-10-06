import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import PlacementDemo from "./demos/placement";
import placementCode from "./demos/placement.tsx?raw";
import SizesLoadingDemo from "./demos/sizes-loading";
import sizesLoadingCode from "./demos/sizes-loading.tsx?raw";
import NestedPushDemo from "./demos/nested-push";
import nestedPushCode from "./demos/nested-push.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="drawer"
      imports={['Drawer', 'type DrawerProps']}
      whenToUse={<p>Use for deep-dive details, complex forms, or side configuration menus.</p>}
      demos={[
        { title: tr("ลิ้นชักพื้นฐาน", "Basic Drawer"), description: tr("ลิ้นชักเลื่อนเข้ามาจากขอบขวา", "Basic drawer sliding in from the right edge."), code: basicCode, component: <Basic /> },
        {
          title: tr("ตำแหน่ง", "Placement"),
          description: tr("เลื่อนแผงเข้ามาได้ทั้งสี่ด้าน", "Slide the panel in from any of the four edges."),
          code: placementCode,
          component: <PlacementDemo />,
        },
        {
          title: tr("ขนาด ส่วนท้าย และสถานะโหลด", "Sizes, Footer and Loading"),
          description: tr("ขนาดสำเร็จรูปพร้อมส่วนท้าย และโครงร่างระหว่างโหลดเนื้อหา", "Preset sizes with a footer, and a skeleton while the body loads."),
          code: sizesLoadingCode,
          component: <SizesLoadingDemo />,
        },
        {
          title: tr("ลิ้นชักซ้อน", "Nested Drawers"),
          description: tr("ลิ้นชักลูกดันตัวแม่ออกไป กด Escape ปิดตัวบนสุดก่อน", "A child drawer pushes its parent aside; Escape closes the top one first."),
          code: nestedPushCode,
          component: <NestedPushDemo />,
        },
      ]}
      api={[{'title': 'Drawer', 'rows': [{'property': 'open', 'description': 'Whether the drawer dialog is visible', 'type': 'boolean', 'default': 'false'}, {'property': 'placement', 'description': 'The placement of drawer', 'type': 'top | right | bottom | left', 'default': 'right'}, {'property': 'size', 'description': 'Preset size of drawer', 'type': 'default | large', 'default': 'default'}, {'property': 'title', 'description': 'The title for drawer', 'type': 'ReactNode', 'default': '-'}, {'property': 'onClose', 'description': 'Callback when close requested', 'type': 'function', 'default': '-'}, {'property': 'loading', 'description': 'Show a skeleton instead of the body', 'type': 'boolean', 'default': 'false'}, {'property': 'footer', 'description': 'Footer content', 'type': 'ReactNode', 'default': '-'}, {'property': 'keyboard', 'description': 'Close on Escape', 'type': 'boolean', 'default': 'true'}, {'property': 'closeIcon', 'description': 'Custom close icon, false hides the button', 'type': 'ReactNode | boolean', 'default': '-'}, {'property': 'push', 'description': 'Offset this drawer when a nested one opens', 'type': 'boolean | { distance }', 'default': 'true'}, {'property': 'destroyOnClose', 'description': 'Unmount children after close', 'type': 'boolean', 'default': 'false'}, {'property': 'afterOpenChange', 'description': 'Fires once the animation settles', 'type': '(open) => void', 'default': '-'}, {'property': 'drawerRender', 'description': 'Wrap the panel, e.g. in a form', 'type': '(node) => ReactNode', 'default': '-'}, {'property': 'getContainer', 'description': 'Portal target; false renders in place', 'type': 'HTMLElement | () => HTMLElement | false', 'default': 'document.body'}]}]}
    />
  );
}
