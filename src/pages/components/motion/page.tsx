import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import BlurTextDemo from "./demos/blur-text";
import blurTextCode from "./demos/blur-text.tsx?raw";
import SplitTextDemo from "./demos/split-text";
import splitTextCode from "./demos/split-text.tsx?raw";
import DecryptedTextDemo from "./demos/decrypted-text";
import decryptedTextCode from "./demos/decrypted-text.tsx?raw";
import WaveTextDemo from "./demos/wave-text";
import waveTextCode from "./demos/wave-text.tsx?raw";
import ShinyTextDemo from "./demos/shiny-text";
import shinyTextCode from "./demos/shiny-text.tsx?raw";
import TrueFocusDemo from "./demos/true-focus";
import trueFocusCode from "./demos/true-focus.tsx?raw";
import GradientTextDemo from "./demos/gradient-text";
import gradientTextCode from "./demos/gradient-text.tsx?raw";
import SpotlightCardDemo from "./demos/spotlight-card";
import spotlightCardCode from "./demos/spotlight-card.tsx?raw";
import TiltedCardDemo from "./demos/tilted-card";
import tiltedCardCode from "./demos/tilted-card.tsx?raw";
import BorderBeamDemo from "./demos/border-beam";
import borderBeamCode from "./demos/border-beam.tsx?raw";
import MeteorCardDemo from "./demos/meteor-card";
import meteorCardCode from "./demos/meteor-card.tsx?raw";
import MagneticButtonDemo from "./demos/magnetic-button";
import magneticButtonCode from "./demos/magnetic-button.tsx?raw";
import RippleEffectDemo from "./demos/ripple-effect";
import rippleEffectCode from "./demos/ripple-effect.tsx?raw";
import AnimatedBadgeDemo from "./demos/animated-badge";
import animatedBadgeCode from "./demos/animated-badge.tsx?raw";
import SpringEasingDemo from "./demos/spring-easing";
import springEasingCode from "./demos/spring-easing.tsx?raw";
import HoverPopDemo from "./demos/hover-pop";
import hoverPopCode from "./demos/hover-pop.tsx?raw";

const CHARS_DEFAULT = "A-Z a-z !@#$…";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="motion"
      imports={[
        "BlurText",
        "SplitText",
        "DecryptedText",
        "WaveText",
        "ShinyText",
        "TrueFocus",
        "GradientText",
        "SpotlightCard",
        "TiltedCard",
        "BorderBeam",
        "MeteorCard",
        "MagneticButton",
        "RippleEffect",
        "AnimatedBadge",
      ]}
      whenToUse={tr(
        <>
          <p>
            Motion คือชุดเอฟเฟกต์ 14 ตัวสำหรับ "จุดเด่น" ของหน้า — หัวข้อหลัก, การ์ดราคา, ปุ่ม call-to-action —
            ทุกตัวเขียนด้วย React + Tailwind v4 ล้วน ไม่มีไลบรารีแอนิเมชันเพิ่ม
          </p>
          <ul>
            <li><b>ข้อความ</b>: <code>BlurText</code>, <code>SplitText</code>, <code>DecryptedText</code>, <code>WaveText</code>, <code>ShinyText</code>, <code>TrueFocus</code>, <code>GradientText</code></li>
            <li><b>การ์ด/คอนเทนเนอร์</b>: <code>SpotlightCard</code>, <code>TiltedCard</code>, <code>BorderBeam</code>, <code>MeteorCard</code></li>
            <li><b>ไมโครอินเทอร์แอ็กชัน</b>: <code>MagneticButton</code>, <code>RippleEffect</code>, <code>AnimatedBadge</code></li>
          </ul>
          <p className="mt-2">
            ใช้เท่าที่จำเป็น — หนึ่งหน้าควรมีจุดที่เคลื่อนไหวไม่กี่จุด สำหรับอินเทอร์แอ็กชันทั่วไป (ปุ่ม เมนู ป็อปอัป)
            ให้ใช้ยูทิลิตี้ <code>kk-*</code> ใน <code>index.css</code> แทน
          </p>
          <p className="mt-2">
            สีทุกตัวมีค่าเริ่มต้นเป็น design token จึงสลับโหมดมืดเองอัตโนมัติ และจะส่ง CSS color ใดก็ได้เข้าไปแทนได้
            ทุกแอนิเมชันหยุดเองเมื่อผู้ใช้ตั้ง <code>prefers-reduced-motion</code>
          </p>
        </>,
        <>
          <p>
            Motion is a set of 14 effects for the parts of a page that should stand out — a hero heading,
            a pricing card, a call-to-action. All of it is plain React + Tailwind v4, with no animation library.
          </p>
          <ul>
            <li><b>Text</b>: <code>BlurText</code>, <code>SplitText</code>, <code>DecryptedText</code>, <code>WaveText</code>, <code>ShinyText</code>, <code>TrueFocus</code>, <code>GradientText</code></li>
            <li><b>Cards / containers</b>: <code>SpotlightCard</code>, <code>TiltedCard</code>, <code>BorderBeam</code>, <code>MeteorCard</code></li>
            <li><b>Micro-interactions</b>: <code>MagneticButton</code>, <code>RippleEffect</code>, <code>AnimatedBadge</code></li>
          </ul>
          <p className="mt-2">
            Use them sparingly — a page needs only a few moving parts. For everyday interaction feedback
            (buttons, menus, popups) reach for the <code>kk-*</code> utilities in <code>index.css</code> instead.
          </p>
          <p className="mt-2">
            Every colour defaults to a design token, so dark mode follows automatically, and any CSS colour can be
            passed instead. All animations stop when the user asks for <code>prefers-reduced-motion</code>.
          </p>
        </>,
      )}
      demos={[
        {
          title: tr("Spring easing", "Spring easing"),
          description: tr(
            "โทเคน --kk-ease-spring* สุ่มจากสปริงจริงแล้วเขียนเป็น linear() — ได้ความรู้สึกแบบ spring โดยไม่ต้องรัน JS",
            "The --kk-ease-spring* tokens are sampled from a real spring and written as linear(), so the motion feels sprung without a JS animation loop.",
          ),
          code: springEasingCode,
          component: <SpringEasingDemo />,
        },
        {
          title: tr("Hover / press", "Hover and press"),
          description: tr(
            "kk-hover-pop และ kk-press ให้ปุ่มและการ์ดขยับเล็กน้อยตอนชี้ และเด้งกลับแบบสปริงตอนปล่อย",
            "kk-hover-pop and kk-press nudge a control on hover and let it spring back on release.",
          ),
          code: hoverPopCode,
          component: <HoverPopDemo />,
        },
        {
          title: tr("ข้อความเบลอเข้า", "Blur Text"),
          description: tr(
            <>เผยทีละคำหรือทีละตัวอักษรเมื่อเลื่อนมาถึง ตั้งระยะห่างด้วย <code>delay</code> และทิศทางด้วย <code>direction</code></>,
            <>Reveals word by word or letter by letter when scrolled into view. <code>delay</code> sets the stagger, <code>direction</code> the entry side.</>,
          ),
          code: blurTextCode,
          component: <BlurTextDemo />,
        },
        {
          title: tr("แยกตัวอักษร", "Split Text"),
          description: tr(
            <>เลื่อนตัวอักษรเข้าทีละตัว กำหนดสถานะเริ่ม/จบเองได้ด้วย <code>animationFrom</code> / <code>animationTo</code></>,
            <>Slides each character in. Define the start and end states yourself with <code>animationFrom</code> / <code>animationTo</code>.</>,
          ),
          code: splitTextCode,
          component: <SplitTextDemo />,
        },
        {
          title: tr("ข้อความถอดรหัส", "Decrypted Text"),
          description: tr(
            <>สลับอักษรมั่วก่อนเผยของจริง <code>useOriginalCharsOnly</code> จำกัดให้สุ่มเฉพาะตัวอักษรที่มีในข้อความนั้น</>,
            <>Scrambles before settling on the real text. <code>useOriginalCharsOnly</code> limits the noise to the characters the text itself contains.</>,
          ),
          code: decryptedTextCode,
          component: <DecryptedTextDemo />,
          full: true,
        },
        {
          title: tr("ข้อความคลื่น", "Wave Text"),
          description: tr(
            <>ตัวอักษรลอยขึ้นทีละตัวตอนเข้าหน้าจอ (<code>delay</code> = ระยะห่างเป็นวินาที) แล้วยังยกตามเมาส์เมื่อชี้</>,
            <>Characters rise one after another on mount (<code>delay</code> is the stagger in seconds), and still lift under the pointer.</>,
          ),
          code: waveTextCode,
          component: <WaveTextDemo />,
        },
        {
          title: tr("ข้อความมันวาว", "Shiny Text"),
          description: tr(
            <>แสงกวาดผ่านข้อความต่อเนื่อง สีมาจากโทเคน <code>baseColor</code> / <code>shineColor</code> จึงอ่านออกทั้งโหมดสว่างและมืด</>,
            <>A highlight sweeps across the text. <code>baseColor</code> / <code>shineColor</code> default to tokens, so it reads in light and dark.</>,
          ),
          code: shinyTextCode,
          component: <ShinyTextDemo />,
        },
        {
          title: tr("โฟกัสทีละคำ", "True Focus"),
          description: tr(
            <>เบลอทุกคำยกเว้นคำที่โฟกัส พร้อมกรอบเลื่อนตาม เปิด <code>manualMode</code> เพื่อให้ตามเมาส์</>,
            <>Blurs every word except the focused one and slides a frame onto it. <code>manualMode</code> hands control to the pointer.</>,
          ),
          code: trueFocusCode,
          component: <TrueFocusDemo />,
          full: true,
        },
        {
          title: tr("ข้อความไล่สี", "Gradient Text"),
          description: tr(
            <>ไล่สีไหลผ่านตัวอักษร <code>showBorder</code> เพิ่มกรอบไล่สีรอบข้อความ</>,
            <>A gradient flows through the glyphs. <code>showBorder</code> wraps the text in a matching gradient frame.</>,
          ),
          code: gradientTextCode,
          component: <GradientTextDemo />,
        },
        {
          title: tr("การ์ดสปอตไลต์", "Spotlight Card"),
          description: tr(
            <>วงแสงเรเดียลวิ่งตามเคอร์เซอร์ เหมาะกับการ์ดฟีเจอร์ที่ต้องการให้ดูมีชีวิต</>,
            <>A radial glow follows the cursor — good for feature cards that should feel alive.</>,
          ),
          code: spotlightCardCode,
          component: <SpotlightCardDemo />,
        },
        {
          title: tr("การ์ดเอียง 3 มิติ", "Tilted Card"),
          description: tr(
            <>เอียงตามตำแหน่งเมาส์แบบ 3D ปรับได้ด้วย <code>maxAngle</code>, <code>scale</code>, <code>perspective</code></>,
            <>Tilts in 3D towards the pointer. Tune it with <code>maxAngle</code>, <code>scale</code> and <code>perspective</code>.</>,
          ),
          code: tiltedCardCode,
          component: <TiltedCardDemo />,
        },
        {
          title: tr("ลำแสงวิ่งขอบ", "Border Beam"),
          description: tr(
            <>วางทับใน container ที่เป็น <code>relative</code> แล้วจะมีลำแสงวิ่งรอบขอบ ใช้เน้นแพ็กเกจแนะนำ</>,
            <>Drop it inside any <code>relative</code> container and a light orbits the border — handy for a highlighted plan.</>,
          ),
          code: borderBeamCode,
          component: <BorderBeamDemo />,
        },
        {
          title: tr("การ์ดดาวตก", "Meteor Card"),
          description: tr(
            <>ดาวตกพาดผ่านพื้นหลัง ตำแหน่งคำนวณจากลำดับที่ (deterministic) จึงไม่ขยับใหม่ทุกครั้งที่ re-render</>,
            <>Meteors streak across the background. Their positions are derived from the index, so they stay put across re-renders.</>,
          ),
          code: meteorCardCode,
          component: <MeteorCardDemo />,
        },
        {
          title: tr("ปุ่มแม่เหล็ก", "Magnetic Button"),
          description: tr(
            <>ปุ่มขยับเข้าหาเคอร์เซอร์ตาม <code>strength</code> แล้วดีดกลับที่เดิมเมื่อเมาส์ออก</>,
            <>The button drifts towards the cursor by <code>strength</code> and springs back when the pointer leaves.</>,
          ),
          code: magneticButtonCode,
          component: <MagneticButtonDemo />,
        },
        {
          title: tr("คลื่นเมื่อคลิก", "Ripple Effect"),
          description: tr(
            <>ห่อพื้นที่ใดก็ได้เพื่อให้เกิดคลื่นจากจุดที่คลิก ปรับสีและความยาวด้วย <code>color</code> / <code>duration</code></>,
            <>Wrap any surface to get a ripple from the click point. <code>color</code> and <code>duration</code> control it.</>,
          ),
          code: rippleEffectCode,
          component: <RippleEffectDemo />,
        },
        {
          title: tr("ป้ายมีชีพจร", "Animated Badge"),
          description: tr(
            <>ป้ายสถานะพร้อมจุดกะพริบ ปิดจุดได้ด้วย <code>{"ping={false}"}</code></>,
            <>A status pill with a pinging dot. Turn the dot off with <code>{"ping={false}"}</code>.</>,
          ),
          code: animatedBadgeCode,
          component: <AnimatedBadgeDemo />,
        },
      ]}
      api={[
        {
          title: "BlurText",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLHeadingElement> (เรนเดอร์เป็น <h2>)", "Extends React.HTMLAttributes<HTMLHeadingElement> (renders an <h2>)."),
          rows: [
            { property: "text", description: tr("ข้อความที่จะเผย", "The text to reveal"), type: "string", default: "-" },
            { property: "delay", description: tr("ระยะห่างระหว่างชิ้น (มิลลิวินาที)", "Stagger between pieces, in ms"), type: "number", default: "50" },
            { property: "animateBy", description: tr("แบ่งเป็นคำหรือตัวอักษร", "Split by words or by letters"), type: "words | letters", default: "words" },
            { property: "direction", description: tr("ทิศทางที่เลื่อนเข้ามา", "Side the text slides in from"), type: "top | bottom", default: "top" },
            { property: "onAnimationComplete", description: tr("เรียกเมื่อชิ้นสุดท้ายจบ", "Fires when the last piece finishes"), type: "() => void", default: "-" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "SplitText",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLSpanElement>", "Extends React.HTMLAttributes<HTMLSpanElement>."),
          rows: [
            { property: "text", description: tr("ข้อความที่จะแยกเป็นตัวอักษร", "Text split into characters"), type: "string", default: "-" },
            { property: "delay", description: tr("ระยะห่างระหว่างตัวอักษร (มิลลิวินาที)", "Stagger between characters, in ms"), type: "number", default: "40" },
            { property: "animationFrom", description: tr("สถานะเริ่มต้นของแต่ละตัวอักษร", "Start state of each character"), type: "{ opacity: number; transform: string }", default: "{ opacity: 0, transform: \"translateY(30px)\" }" },
            { property: "animationTo", description: tr("สถานะปลายทางของแต่ละตัวอักษร", "End state of each character"), type: "{ opacity: number; transform: string }", default: "{ opacity: 1, transform: \"translateY(0)\" }" },
            { property: "easing", description: tr("ฟังก์ชันจังหวะของทรานซิชัน", "Transition timing function"), type: "string", default: "cubic-bezier(0.16, 1, 0.3, 1)" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "DecryptedText",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLSpanElement>", "Extends React.HTMLAttributes<HTMLSpanElement>."),
          rows: [
            { property: "text", description: tr("ข้อความจริงที่จะถูกเผย", "The real text to settle on"), type: "string", default: "-" },
            { property: "speed", description: tr("ช่วงเวลาระหว่างเฟรมสุ่ม (มิลลิวินาที)", "Interval between scramble frames, in ms"), type: "number", default: "50" },
            { property: "maxIterations", description: tr("จำนวนเฟรมก่อนเผยครบ", "Number of frames before the text is fully revealed"), type: "number", default: "10" },
            { property: "sequential", description: tr("เผยทีละตัวตามลำดับ ถ้า false จะเผยพร้อมกันตอนจบ", "Reveal progressively; when false everything lands at once"), type: "boolean", default: "true" },
            { property: "revealDirection", description: tr("จุดเริ่มการเผย: ต้น / ท้าย / กลางออกไปนอก", "Where the reveal starts: beginning, end, or the middle outwards"), type: "start | end | center", default: "start" },
            { property: "useOriginalCharsOnly", description: tr("สุ่มจากเฉพาะตัวอักษรที่มีในข้อความนั้นเอง", "Scramble using only the characters present in the original text"), type: "boolean", default: "false" },
            { property: "characters", description: tr("ชุดตัวอักษรที่ใช้สุ่ม (ถูกละเมื่อ useOriginalCharsOnly)", "Character pool used for scrambling (ignored when useOriginalCharsOnly is set)"), type: "string", default: CHARS_DEFAULT },
            { property: "encryptedClassName", description: tr("คลาสของตัวอักษรที่ยังไม่ถูกเผย", "Class applied to characters that are still scrambled"), type: "string", default: "-" },
            { property: "animateOn", description: tr("ทริกเกอร์: ชี้เมาส์ หรือเมื่อเลื่อนมาถึง", "Trigger: pointer hover, or entering the viewport"), type: "view | hover", default: "hover" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "WaveText",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLSpanElement>", "Extends React.HTMLAttributes<HTMLSpanElement>."),
          rows: [
            { property: "text", description: tr("ข้อความที่จะไล่ขึ้นเป็นคลื่น", "Text that rides in as a wave"), type: "string", default: "-" },
            { property: "delay", description: tr("ระยะห่างระหว่างตัวอักษรของคลื่นตอนเข้า (วินาที)", "Stagger between characters of the entrance wave, in seconds"), type: "number", default: "0.05" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "ShinyText",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLSpanElement>", "Extends React.HTMLAttributes<HTMLSpanElement>."),
          rows: [
            { property: "text", description: tr("ข้อความที่จะให้แสงกวาด", "Text the highlight sweeps across"), type: "string", default: "-" },
            { property: "disabled", description: tr("หยุดแอนิเมชัน คงสีพื้นไว้", "Stop the animation, keep the base colour"), type: "boolean", default: "false" },
            { property: "speed", description: tr("เวลาต่อรอบ (วินาที)", "Seconds per sweep"), type: "number", default: "4" },
            { property: "baseColor", description: tr("สีพื้นของข้อความ (CSS color ใดก็ได้)", "Resting colour of the text (any CSS colour)"), type: "string", default: "var(--kk-text-tertiary)" },
            { property: "shineColor", description: tr("สีของแสงที่กวาดผ่าน", "Colour of the sweeping highlight"), type: "string", default: "var(--kk-text)" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "TrueFocus",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLDivElement>", "Extends React.HTMLAttributes<HTMLDivElement>."),
          rows: [
            { property: "sentence", description: tr("ประโยคที่จะไล่โฟกัสทีละคำ", "Sentence focused one word at a time"), type: "string", default: "True Focus Motion System" },
            { property: "manualMode", description: tr("ให้เมาส์เป็นตัวเลือกคำแทนการวนอัตโนมัติ", "Let the pointer pick the word instead of cycling automatically"), type: "boolean", default: "false" },
            { property: "blurAmount", description: tr("ความเบลอของคำที่ไม่ได้โฟกัส (px)", "Blur of the unfocused words, in px"), type: "number", default: "4" },
            { property: "borderColor", description: tr("สีกรอบของคำที่โฟกัส", "Colour of the focus frame"), type: "string", default: "var(--kk-primary)" },
            { property: "glowColor", description: tr("สีเรืองรอบกรอบ", "Glow colour around the frame"), type: "string", default: "var(--kk-primary-border-hover)" },
            { property: "animationDuration", description: tr("เวลาย้ายโฟกัส (วินาที)", "Seconds the focus takes to move"), type: "number", default: "0.5" },
            { property: "pauseBetweenAnimations", description: tr("เวลาหยุดค้างต่อคำ (วินาที) ใช้กับโหมดอัตโนมัติ", "Seconds held on each word, automatic mode only"), type: "number", default: "1" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "GradientText",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLSpanElement>", "Extends React.HTMLAttributes<HTMLSpanElement>."),
          rows: [
            { property: "children", description: tr("เนื้อหาที่จะไล่สี", "Content to paint with the gradient"), type: "ReactNode", default: "-" },
            { property: "colors", description: tr("จุดสีของเกรเดียนต์ (CSS color ใดก็ได้)", "Gradient stops (any CSS colour)"), type: "string[]", default: "[primary, success, warning, error, primary-hover] tokens" },
            { property: "animationSpeed", description: tr("เวลาต่อรอบการไหล (วินาที)", "Seconds per flow cycle"), type: "number", default: "6" },
            { property: "showBorder", description: tr("ใส่กรอบไล่สีรอบข้อความ", "Wrap the text in a gradient border"), type: "boolean", default: "false" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน element หลัก", "Extra classes on the root element"), type: "string", default: "-" },
          ],
        },
        {
          title: "SpotlightCard",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLDivElement>", "Extends React.HTMLAttributes<HTMLDivElement>."),
          rows: [
            { property: "children", description: tr("เนื้อหาในการ์ด", "Card content"), type: "ReactNode", default: "-" },
            { property: "spotlightColor", description: tr("สีของวงแสงที่ตามเคอร์เซอร์ (CSS color ใดก็ได้)", "Colour of the cursor spotlight (any CSS colour)"), type: "string", default: "var(--kk-primary-bg)" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนการ์ด", "Extra classes on the card"), type: "string", default: "-" },
          ],
        },
        {
          title: "TiltedCard",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLDivElement>", "Extends React.HTMLAttributes<HTMLDivElement>."),
          rows: [
            { property: "children", description: tr("เนื้อหาในการ์ด", "Card content"), type: "ReactNode", default: "-" },
            { property: "maxAngle", description: tr("มุมเอียงสูงสุด (องศา)", "Maximum tilt angle, in degrees"), type: "number", default: "12" },
            { property: "scale", description: tr("อัตราขยายตอนชี้เมาส์", "Scale applied while hovering"), type: "number", default: "1.02" },
            { property: "perspective", description: tr("ระยะ perspective ของ 3D (px)", "3D perspective distance, in px"), type: "number", default: "1000" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนการ์ด", "Extra classes on the card"), type: "string", default: "-" },
          ],
        },
        {
          title: "BorderBeam",
          description: tr("วางไว้ใน container ที่เป็น position: relative และ overflow-hidden", "Place inside a position: relative, overflow-hidden container."),
          rows: [
            { property: "size", description: tr("ความยาวของลำแสง (px)", "Length of the beam, in px"), type: "number", default: "200" },
            { property: "duration", description: tr("เวลาต่อรอบ (วินาที)", "Seconds per lap"), type: "number", default: "8" },
            { property: "borderWidth", description: tr("ความหนาของเส้นขอบ (px)", "Border thickness, in px"), type: "number", default: "1.5" },
            { property: "colorFrom", description: tr("สีหัวลำแสง (CSS color ใดก็ได้)", "Head colour of the beam (any CSS colour)"), type: "string", default: "var(--kk-primary)" },
            { property: "colorTo", description: tr("สีหางลำแสง", "Tail colour of the beam"), type: "string", default: "var(--kk-success)" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนชั้นลำแสง", "Extra classes on the beam layer"), type: "string", default: "-" },
          ],
        },
        {
          title: "MeteorCard",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLDivElement>", "Extends React.HTMLAttributes<HTMLDivElement>."),
          rows: [
            { property: "children", description: tr("เนื้อหาในการ์ด (อยู่เหนือชั้นดาวตก)", "Card content, rendered above the meteor layer"), type: "ReactNode", default: "-" },
            { property: "number", description: tr("จำนวนดาวตก", "How many meteors to draw"), type: "number", default: "16" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนการ์ด", "Extra classes on the card"), type: "string", default: "-" },
          ],
        },
        {
          title: "MagneticButton",
          description: tr("ขยายจาก React.ButtonHTMLAttributes<HTMLButtonElement>", "Extends React.ButtonHTMLAttributes<HTMLButtonElement>."),
          rows: [
            { property: "children", description: tr("เนื้อหาในปุ่ม", "Button content"), type: "ReactNode", default: "-" },
            { property: "strength", description: tr("สัดส่วนที่ปุ่มขยับตามเคอร์เซอร์ (0 = ไม่ขยับ)", "How far the button follows the cursor (0 = no pull)"), type: "number", default: "0.35" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนปุ่ม", "Extra classes on the button"), type: "string", default: "-" },
          ],
        },
        {
          title: "RippleEffect",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLDivElement>", "Extends React.HTMLAttributes<HTMLDivElement>."),
          rows: [
            { property: "children", description: tr("พื้นที่ที่จะเกิดคลื่นเมื่อคลิก", "Surface the ripple is drawn over"), type: "ReactNode", default: "-" },
            { property: "color", description: tr("สีคลื่น (CSS color ใดก็ได้)", "Ripple colour (any CSS colour)"), type: "string", default: "var(--kk-primary-bg-hover)" },
            { property: "duration", description: tr("อายุของคลื่นหนึ่งลูก (มิลลิวินาที)", "Lifetime of one ripple, in ms"), type: "number", default: "600" },
            { property: "className", description: tr("คลาสเพิ่มเติมบน wrapper", "Extra classes on the wrapper"), type: "string", default: "-" },
          ],
        },
        {
          title: "AnimatedBadge",
          description: tr("ขยายจาก React.HTMLAttributes<HTMLSpanElement>", "Extends React.HTMLAttributes<HTMLSpanElement>."),
          rows: [
            { property: "children", description: tr("ข้อความในป้าย", "Badge label"), type: "ReactNode", default: "-" },
            { property: "color", description: tr("สีของป้าย (โทเคนความหมาย)", "Badge colour, from the semantic tokens"), type: "primary | success | warning | error | purple", default: "primary" },
            { property: "ping", description: tr("แสดงจุดกะพริบด้านหน้า", "Show the pinging dot"), type: "boolean", default: "true" },
            { property: "className", description: tr("คลาสเพิ่มเติมบนป้าย", "Extra classes on the badge"), type: "string", default: "-" },
          ],
        },
      ]}
      extra={tr(
        <>
          <h2>หมายเหตุการใช้งาน</h2>
          <h3>ห่อคอมโพเนนต์อื่นได้เลย</h3>
          <p>
            ทุกตัวรับ <code>className</code> และพร็อพ HTML ที่เหลือ จึงเอาไปครอบ Card, Button หรือ Tag ของ KKUI ได้ตรงๆ
            ส่วน <code>BorderBeam</code> ต้องอยู่ใน container ที่เป็น <code>relative</code> และ <code>overflow-hidden</code>
          </p>
          <h3>สีและโหมดมืด</h3>
          <p>
            ค่าเริ่มต้นของสีทุกตัวเป็นตัวแปรโทเคน (<code>var(--kk-primary)</code>, <code>var(--kk-text)</code> …) จึงเปลี่ยนตามธีมเอง
            ถ้าจะกำหนดเอง ส่ง CSS color ใดก็ได้เข้าไป
          </p>
          <h3>ประสิทธิภาพ</h3>
          <p>
            แอนิเมชันทั้งหมดเป็น CSS keyframes ใน <code>index.css</code> (<code>shiny</code>, <code>border-beam</code>,{" "}
            <code>meteor</code>, <code>ripple</code>, <code>gradient-flow</code>) ไม่มี JS ไทม์ไลน์ และหยุดเองเมื่อผู้ใช้เปิด
            reduced motion
          </p>
        </>,
        <>
          <h2>Notes</h2>
          <h3>They wrap other components</h3>
          <p>
            Each one takes <code>className</code> plus the remaining HTML props, so you can wrap a KKUI Card, Button or Tag
            directly. <code>BorderBeam</code> is the exception: it needs a <code>relative</code>, <code>overflow-hidden</code> parent.
          </p>
          <h3>Colour and dark mode</h3>
          <p>
            Every colour default is a token variable (<code>var(--kk-primary)</code>, <code>var(--kk-text)</code> …), so themes
            follow automatically. Pass any CSS colour to override.
          </p>
          <h3>Cost</h3>
          <p>
            Everything runs on the CSS keyframes already in <code>index.css</code> (<code>shiny</code>, <code>border-beam</code>,{" "}
            <code>meteor</code>, <code>ripple</code>, <code>gradient-flow</code>) — no JS timeline, and it all stops under
            reduced motion.
          </p>
        </>,
      )}
      related={[
        { title: "Card", path: "/components/card" },
        { title: "Button", path: "/components/button" },
        { title: "Badge", path: "/components/badge" },
      ]}
    />
  );
}
