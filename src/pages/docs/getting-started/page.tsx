import { CodeBlock } from "@/components/docs/code-block";
import { tr, useLocale } from "@/i18n/locale";

const install = {
  th: `# 1. Vite + React + TypeScript + Tailwind v4
bun create vite my-app --template react-ts
cd my-app && bun add tailwindcss @tailwindcss/vite
# vite.config.ts → plugins: [react(), tailwindcss()], alias "@" → ./src

# 2. โทเคน KKUI + cn()  (เขียน src/index.css, src/lib/utils.ts และติดตั้ง dep พื้นฐาน)
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - init

# 3. เพิ่มคอมโพเนนต์ — ไฟล์ลง src/components/ui/ โค้ดเป็นของคุณ
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add button card table

# ดูรายชื่อทั้งหมด:  curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - list`,
  en: `# 1. Vite + React + TypeScript + Tailwind v4
bun create vite my-app --template react-ts
cd my-app && bun add tailwindcss @tailwindcss/vite
# vite.config.ts → plugins: [react(), tailwindcss()], alias "@" → ./src

# 2. KKUI tokens + cn() (writes src/index.css, src/lib/utils.ts, installs base deps)
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - init

# 3. Add components — files land in src/components/ui/, you own the code
curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add button card table

# see everything:  curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - list`,
};

const usage = `import { Button } from "@/components/ui/button";

export default function App() {
  return <Button type="primary">Hello KKUI</Button>;
}`;

const layoutCode = {
  th: `src/
  index.css              # โทเคน + @theme (Tailwind v4)
  lib/utils.ts           # cn()
  hooks/use-wave.ts      # เอฟเฟกต์ ripple ตอนคลิก (เพิ่มให้เมื่อคอมโพเนนต์ต้องใช้)
  components/ui/*.tsx    # คอมโพเนนต์ — ไฟล์ละตัว
`,
  en: `src/
  index.css              # tokens + @theme (Tailwind v4)
  lib/utils.ts           # cn()
  hooks/use-wave.ts      # click ripple (added when a component needs it)
  components/ui/*.tsx    # the components — one file each
`,
};

export default function GettingStarted() {
  const { l, lang } = useLocale();
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="mt-10 mb-3 text-h4 font-semibold text-text-heading">{children}</h2>;
  return (
    <article className="prose-kk max-w-3xl pb-24 [&_code]:rounded-sm [&_code]:bg-fill-tertiary [&_code]:px-1 [&_code]:font-mono [&_code]:text-[.9em]">
      <h1 className="text-h2 font-semibold text-text-heading">{l(tr("เริ่มต้นใช้งาน", "Getting Started"))}</h1>
      <p className="mt-2 text-text-secondary">
        {l(
          tr(
            "KKUI คือชุดคอมโพเนนต์ React ระดับ enterprise ครบทุกหมวด สร้างบน Tailwind CSS v4 — โค้ดของเราเองตั้งแต่ต้นจนจบ ไม่มีแพ็กเกจบน npm: คุณคัดลอกซอร์สเข้าโปรเจกต์ (ผ่าน KKUI CLI หรือก๊อปเองจากหน้าคอมโพเนนต์) แล้วมันก็เป็นของคุณ",
            "KKUI is a complete enterprise component set built on Tailwind CSS v4 — our own code end to end. Nothing is published to npm: you copy the source into your project (with the KKUI CLI, or by hand from any component page) and it becomes yours.",
          ),
        )}
      </p>

      <H>{l(tr("ทำไมต้อง KKUI", "Why"))}</H>
      <ul className="list-disc space-y-1 pl-5 text-text">
        {lang === "th" ? (
          <>
            <li>API ที่คุ้นมือ: <code>type="primary"</code>, <code>danger</code>, <code>size</code>, <code>Space</code>, <code>Form.Item</code>…</li>
            <li>ไม่มี CSS-in-JS สไตล์เป็น Tailwind class ที่ขับด้วย CSS variables (สว่าง/มืด ปรับธีมได้ในไฟล์เดียว)</li>
            <li>KKUI primitives ที่เข้าถึงได้ (Dialog, Popover, Select, Tooltip…) — headless ไม่มีสไตล์ เราแต่งเอง</li>
            <li>คอมโพเนนต์ไฟล์เดียว ไม่มีแพ็กเกจให้อัปเกรด ไม่มีกล่องดำ อยากแก้ก็แก้ไฟล์</li>
          </>
        ) : (
          <>
            <li>The familiar enterprise API: <code>type="primary"</code>, <code>danger</code>, <code>size</code>, <code>Space</code>, <code>Form.Item</code>…</li>
            <li>Zero CSS-in-JS. Styles are Tailwind classes driven by CSS variables (light/dark, themeable in one file).</li>
            <li>Accessible KKUI primitives (Dialog, Popover, Select, Tooltip…) — headless, unstyled, ours to style.</li>
            <li>Single-file components. No package to upgrade, no black box: edit the file when you need to.</li>
          </>
        )}
      </ul>

      <H>{l(tr("ติดตั้ง", "Install"))}</H>
      <CodeBlock code={l(install)} language="bash" />
      <p className="mt-3 text-sm text-text-secondary">
        {lang === "th" ? (
          <>
            CLI เป็นสคริปต์ Bun ~100 บรรทัดที่เสิร์ฟจากเว็บนี้ (<code>/cli.ts</code>) มันดาวน์โหลด <code>/r/&lt;name&gt;.json</code> เขียนไฟล์ ตามรายการ <code>uses</code> ของคอมโพเนนต์ แล้วรัน <code>bun add</code> ให้ dep ที่ต้องใช้ ถ้าอยากทำเอง ทุกหน้าคอมโพเนนต์แสดงซอร์สให้ และ <code>/r/&lt;name&gt;.tsx</code> คือไฟล์ดิบ
          </>
        ) : (
          <>
            The CLI is a ~100 line Bun script served from this site (<code>/cli.ts</code>). It downloads <code>/r/&lt;name&gt;.json</code>, writes the files, follows the component's <code>uses</code> list, and runs <code>bun add</code> for npm deps. Prefer manual? Every component page shows the source; <code>/r/&lt;name&gt;.tsx</code> is the raw file.
          </>
        )}
      </p>

      <H>{l(tr("ใช้งาน", "Use"))}</H>
      <CodeBlock code={usage} />

      <H>{l(tr("โครงสร้างโปรเจกต์", "Project layout"))}</H>
      <CodeBlock language="bash" code={l(layoutCode)} />

      <H>{l(tr("โหมดมืด", "Dark mode"))}</H>
      <p className="text-text">
        {lang === "th" ? (
          <>สลับคลาส <code>dark</code> บน <code>&lt;html&gt;</code> ทุกโทเคนมีค่าสำหรับโหมดมืดคู่กัน</>
        ) : (
          <>Toggle the <code>dark</code> class on <code>&lt;html&gt;</code>. Every token has a matching dark value.</>
        )}
      </p>

      <H>{l(tr("ภาษา", "Language"))}</H>
      <p className="text-text">
        {lang === "th" ? (
          <>เอกสารมีสองภาษา (ไทยเป็นหลัก / อังกฤษ) สลับได้ที่ปุ่ม TH/EN บนแถบด้านบน ตัวเลือกจะถูกจำไว้ในเบราว์เซอร์</>
        ) : (
          <>Docs are bilingual (Thai first / English). Switch with the TH/EN button in the header; the choice is remembered in your browser.</>
        )}
      </p>
    </article>
  );
}
