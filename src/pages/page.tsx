import { Link } from "react-router-dom";
import { ArrowRight, Blocks, Palette, Copy, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardMeta } from "@/components/ui/card";
import { componentEntries } from "@/routes/autoRoutes";
import { tr, useLocale } from "@/i18n/locale";
import { FadeIn, Reveal } from "@/components/docs/motion";

const features = [
  {
    icon: Blocks,
    title: tr("API ที่คุ้นมือ", "Familiar API"),
    desc: tr(
      "ชุดคอมโพเนนต์ระดับ enterprise ครบทุกหมวด และชื่อพร็อพที่ทุกคนรู้จัก — Button type, Space, Form.Item, Table columns",
      "The enterprise component catalog and prop names you already know — Button type, Space, Form.Item, Table columns.",
    ),
  },
  {
    icon: Palette,
    title: tr("โทเคน Tailwind v4", "Tailwind v4 tokens"),
    desc: tr(
      "ไม่มี CSS-in-JS ทั้งสว่างและมืดเป็น CSS variables + @theme utilities แก้ไฟล์เดียวเปลี่ยนทั้งระบบ",
      "No CSS-in-JS. Semantic light + dark tokens as CSS variables and @theme utilities.",
    ),
  },
  {
    icon: Copy,
    title: tr("คัดลอกแล้วเป็นของคุณ", "Copy & own"),
    desc: tr(
      "ไม่มีแพ็กเกจบน npm คำสั่ง curl | bun บรรทัดเดียวก๊อปซอร์สลง repo ของคุณ แก้ได้เต็มที่",
      "Nothing on npm. One curl | bun command copies the source file into your repo. You own it.",
    ),
  },
  {
    icon: Accessibility,
    title: tr("KKUI primitives", "KKUI primitives"),
    desc: tr(
      "Dialog, Popover, Select, Tooltip และเพื่อนๆ ใช้ KKUI primitives — headless base ที่เข้าถึงได้ (a11y) ตั้งแต่ต้น",
      "Dialog, Popover, Select, Tooltip and friends use KKUI primitives with accessibility built in.",
    ),
  },
];

export default function Home() {
  const { l, lang } = useLocale();
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--kk-primary-bg)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-[1100px] px-6 pt-24 pb-16 text-center">
          <FadeIn className="inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-3 py-1 text-xs font-medium text-primary" direction="zoom">
            v0.1 · {componentEntries.length} {l(tr("คอมโพเนนต์", "components"))}
          </FadeIn>
          <FadeIn as="h1" delay={80} className="mt-6 text-[44px] leading-[1.15] font-semibold tracking-tight text-text-heading sm:text-[56px]">
            {lang === "th" ? (
              <>
                UI ระดับ enterprise
                <br />
                บน <span className="text-primary">Tailwind v4</span> <span className="text-text-secondary">ก๊อปแล้วเป็นของคุณ</span>
              </>
            ) : (
              <>
                Enterprise-grade UI.
                <br />
                <span className="text-primary">Tailwind v4</span> body. <span className="text-text-secondary">Copy &amp; own</span> workflow.
              </>
            )}
          </FadeIn>
          <FadeIn as="p" delay={160} className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            {l(
              tr(
                "KKUI คือชุดคอมโพเนนต์ React ครบทุกหมวด สร้างบน Tailwind CSS v4 และ KKUI primitives — โค้ดของเราเองทั้งหมด ส่งมอบเป็นซอร์สให้คุณคัดลอกเข้าโปรเจกต์",
                "KKUI is a complete enterprise component set built on Tailwind CSS v4 and KKUI primitives — our own code, delivered as source you copy into your project.",
              ),
            )}
          </FadeIn>
          <FadeIn delay={240} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild type="primary" size="lg">
              <Link to="/docs/getting-started">
                {l(tr("เริ่มต้นใช้งาน", "Get started"))} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/components/overview">{l(tr("ดูคอมโพเนนต์ทั้งหมด", "Browse components"))}</Link>
            </Button>
          </FadeIn>
          <FadeIn delay={320} className="mx-auto mt-8 inline-flex max-w-full items-center gap-3 rounded-lg border border-border bg-bg-container px-4 py-2 font-mono text-[13px] text-text-secondary">
            <span className="text-text-tertiary">$</span>
            <span className="truncate">curl -fsSL https://kkui.kksz.dev/cli.ts | bun run - add button</span>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title.en} delay={i * 70}>
              <Card hoverable className="h-full">
                <CardMeta
                  avatar={
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary-bg text-primary">
                      <f.icon className="size-5" />
                    </span>
                  }
                  title={l(f.title)}
                  description={<span className="text-sm">{l(f.desc)}</span>}
                />
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border-secondary bg-bg-layout/60">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-text-heading">{l(tr("คอมโพเนนต์", "Components"))}</h2>
              <p className="mt-1 text-text-secondary">
                {l(tr("7 หมวด: ทั่วไป, เลย์เอาต์, นำทาง, กรอกข้อมูล, แสดงข้อมูล, ตอบกลับ, อื่นๆ", "Seven groups: General, Layout, Navigation, Data Entry, Data Display, Feedback, Other."))}
              </p>
            </div>
            <Link to="/components/overview" className="hidden items-center gap-1 text-primary hover:text-primary-hover sm:flex">
              {l(tr("ทั้งหมด", "All components"))} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {componentEntries.map((c, i) => (
              <Reveal key={c.slug} delay={Math.min(i, 24) * 18} as="span">
                <Link to={c.path} className="kk-press inline-block rounded-md border border-border-secondary bg-bg-container px-3 py-1.5 text-sm text-text transition-[color,border-color,box-shadow] duration-mid hover:border-primary hover:text-primary hover:shadow-kk-tertiary">
                  {c.title}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border-secondary py-8 text-center text-sm text-text-tertiary">KKUI · MIT · Built by KKimSoulz</footer>
    </div>
  );
}
