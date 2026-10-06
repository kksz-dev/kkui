import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import Position from "./demos/position";
import positionCode from "./demos/position.tsx?raw";
import Autoplay from "./demos/autoplay";
import autoplayCode from "./demos/autoplay.tsx?raw";
import Fade from "./demos/fade";
import fadeCode from "./demos/fade.tsx?raw";
import Arrows from "./demos/arrows";
import arrowsCode from "./demos/arrows.tsx?raw";
import CustomArrows from "./demos/custom-arrows";
import customArrowsCode from "./demos/custom-arrows.tsx?raw";
import Methods from "./demos/methods";
import methodsCode from "./demos/methods.tsx?raw";
import SlidesToShow from "./demos/slides-to-show";
import slidesToShowCode from "./demos/slides-to-show.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="carousel"
      imports={["Carousel", "type CarouselRef", "type CarouselProps"]}
      whenToUse={tr(
        <>
          <p>
            สไลด์ข้อความหรือรูปภาพ แสดงทีละสไลด์ หรือหลายสไลด์เรียงต่อกันก็ได้
          </p>
          <ul>
            <li>เมื่อมีเนื้อหาที่เกี่ยวข้องกันในระดับเดียวกันหลายชิ้นที่ต้องแสดง</li>
            <li>เมื่อพื้นที่จำกัด แต่ต้องแสดงแบนเนอร์โปรโมชัน ประกาศ หรือแกลเลอรีรูปที่มีลำดับความสำคัญสูง</li>
            <li>ใช้บ่อยกับแบนเนอร์หน้าแรก การ์ดโปรโมชัน หรือสื่อที่ต้องการเน้น</li>
          </ul>
        </>,
        <>
          <p>
            A carousel of text or images. One slide is shown at a time, or multiple slides in continuous sequence.
          </p>
          <ul>
            <li>When there is a group of related content on the same level to be displayed.</li>
            <li>When space is limited, to display high-priority marketing banners, announcements, or picture galleries.</li>
            <li>Commonly used in homepage hero banners, card promotions, or featured media streams.</li>
          </ul>
        </>,
      )}
      demos={[
        {
          title: tr("พื้นฐาน", "Basic"),
          description: tr("carousel พื้นฐาน 4 สไลด์ ลากหรือคลิกจุดเพื่อเปลี่ยนสไลด์", "Basic carousel with 4 slides. Drag or click dots to switch."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ตำแหน่งจุด", "Position"),
          description: tr(<>วางจุดบอกตำแหน่งไว้ที่ <code>top</code>, <code>bottom</code>, <code>left</code> หรือ <code>right</code> ก็ได้</>, <>The dot indicators can be placed at <code>top</code>, <code>bottom</code>, <code>left</code>, or <code>right</code>.</>),
          code: positionCode,
          component: <Position />,
        },
        {
          title: tr("เล่นอัตโนมัติ", "Autoplay"),
          description: tr(<>เปิดการเลื่อนอัตโนมัติด้วย <code>autoplay</code> ถ้าส่ง <code>{`{ dotDuration: true }`}</code> จุดจะวิ่งเป็นแถบเวลาตามช่วง speed</>, <>Timing scrolling can be enabled via <code>autoplay</code>. Passing <code>{`{ dotDuration: true }`}</code> shows an animated indicator filling across the speed interval.</>),
          code: autoplayCode,
          component: <Autoplay />,
        },
        {
          title: tr("เฟดเข้า", "Fade In"),
          description: tr(<>ตั้ง <code>effect="fade"</code> ให้สไลด์เปลี่ยนแบบไล่ความทึบแทนการเลื่อนแนวนอน</>, <>Slides crossfade with opacity transitions instead of sliding horizontally when <code>effect="fade"</code>.</>),
          code: fadeCode,
          component: <Fade />,
        },
        {
          title: tr("ลูกศร", "Arrows"),
          description: tr(<>ตั้ง <code>arrows</code> เพื่อแสดงปุ่มเลื่อนซ้าย-ขวาตอน hover</>, <>Set <code>arrows</code> to show left and right navigation buttons on hover.</>),
          code: arrowsCode,
          component: <Arrows />,
        },
        {
          title: tr("ลูกศรและจุดแบบกำหนดเอง", "Custom Arrows & Dots"),
          description: tr(<>ส่ง element ของลูกศรเองเข้า <code>{`arrows={{ prevArrow, nextArrow }}`}</code> ได้</>, <>Custom arrow nodes can be passed to <code>{`arrows={{ prevArrow, nextArrow }}`}</code>.</>),
          code: customArrowsCode,
          component: <CustomArrows />,
        },
        {
          title: tr("เมธอดผ่าน ref", "Methods"),
          description: tr(<>สั่งเลื่อนสไลด์เองผ่านเมธอดบน ref: <code>goTo(slide)</code>, <code>next()</code>, <code>prev()</code></>, <>Access imperative navigation via ref methods: <code>goTo(slide)</code>, <code>next()</code>, <code>prev()</code>.</>),
          code: methodsCode,
          component: <Methods />,
        },
        {
          title: tr("หลายสไลด์พร้อมกัน", "Multiple Slides"),
          description: tr(<>แสดงหลายสไลด์พร้อมกันด้วย <code>slidesToShow</code></>, <>Display multiple slides simultaneously using <code>slidesToShow</code>.</>),
          code: slidesToShowCode,
          component: <SlidesToShow />,
        },
      ]}
      api={[
        {
          title: "Carousel",
          rows: [
            { property: "autoplay", description: "Whether to scroll automatically, or config object with dotDuration", type: "boolean | { dotDuration?: boolean }", default: "false" },
            { property: "autoplaySpeed", description: "The amount of time in milliseconds to delay between automatically cycling a slide", type: "number", default: "3000" },
            { property: "pauseOnHover", description: "Whether to pause autoplay on hover", type: "boolean", default: "true" },
            { property: "pauseOnDotsHover", description: "Whether to pause autoplay on dot hover", type: "boolean", default: "false" },
            { property: "dots", description: "Whether to show the dots, or custom className config", type: "boolean | { className?: string }", default: "true" },
            { property: "dotPosition", description: "The position of the dots", type: "top | bottom | left | right", default: "bottom" },
            { property: "effect", description: "Transition effect", type: "scrollx | fade", default: "scrollx" },
            { property: "arrows", description: "Show previous/next arrows or custom arrow elements", type: "boolean | { prevArrow?: ReactNode, nextArrow?: ReactNode }", default: "false" },
            { property: "infinite", description: "Whether to loop slides indefinitely", type: "boolean", default: "true" },
            { property: "speed", description: "Transition animation speed in milliseconds", type: "number", default: "500" },
            { property: "slidesToShow", description: "Number of slides to show at once", type: "number", default: "1" },
            { property: "slidesToScroll", description: "Number of slides to scroll at once", type: "number", default: "1" },
            { property: "draggable", description: "Whether to allow mouse / touch dragging", type: "boolean", default: "true" },
            { property: "beforeChange", description: "Callback function called before slide is changed", type: "(from: number, to: number) => void", default: "-" },
            { property: "afterChange", description: "Callback function called after slide is changed", type: "(current: number) => void", default: "-" },
            { property: "ref", description: "Ref instance providing imperative control methods", type: "React.Ref<CarouselRef>", default: "-" },
          ],
        },
        {
          title: "CarouselRef",
          description: "Methods exposed via ref.",
          rows: [
            { property: "goTo(slide, dontAnimate?)", description: "Go to the target slide index", type: "(slide: number, dontAnimate?: boolean) => void", default: "-" },
            { property: "next()", description: "Change to the next slide", type: "() => void", default: "-" },
            { property: "prev()", description: "Change to the previous slide", type: "() => void", default: "-" },
            { property: "autoPlay(play?)", description: "Start or stop autoplaying slides", type: "(play?: boolean) => void", default: "-" },
          ],
        },
      ]}
      related={[
        { title: "Image", path: "/components/image" },
        { title: "Card", path: "/components/card" },
      ]}
    />
  );
}
