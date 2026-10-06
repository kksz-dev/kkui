import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import CustomCommand from "./demos/custom-command";
import customCommandCode from "./demos/custom-command.tsx?raw";
import ExecDemo from "./demos/exec";
import execDemoCode from "./demos/exec.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="install-tabs"
      imports={["InstallTabs", "type PackageManager"]}
      whenToUse={tr(
        <p>ใช้ในเอกสารติดตั้ง ให้ผู้อ่านคัดลอกคำสั่งของ package manager ที่ตัวเองใช้ได้ทันที และจำไว้ให้หน้าถัดไป</p>,
        <p>Use in installation docs so a reader copies the command for the manager they actually use — and sees it again on the next page.</p>,
      )}
      demos={[
        {
          title: tr("คำสั่งติดตั้งพื้นฐาน", "Basic Install"),
          description: tr("สลับ package manager อัตโนมัติและจำค่าข้ามหน้าเว็บ", "Switch package managers seamlessly with persistence."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ติดตั้งสำหรับ Development (-D)", "Dev Dependencies (-D)"),
          description: tr("ติดตั้งหลายแพ็กเกจพร้อมกันในโหมด devDependencies", "Install multiple packages at once with dev flag."),
          code: customCommandCode,
          component: <CustomCommand />,
        },
        {
          title: tr("คำสั่งเรียกใช้งานครั้งเดียว (npx / bunx / pnpm dlx)", "One-off Runner (Exec)"),
          description: tr("ใช้ action=\"exec\" สำหรับคำสั่ง CLI เช่น bunx / npx", "Use action=\"exec\" for CLI tools execution."),
          code: execDemoCode,
          component: <ExecDemo />,
        },
      ]}
      api={[
        {
          title: "InstallTabs",
          rows: [
            { property: "packages", description: "Package names to install", type: "string | string[]", default: "[]" },
            { property: "commands", description: "Override the generated command per manager", type: "Partial<Record<PackageManager, string>>", default: "-" },
            { property: "managers", description: "Which tabs to show, in order", type: "PackageManager[]", default: "['bun', 'npm', 'pnpm', 'yarn']" },
            { property: "action", description: "install, add, or exec for a one-off run", type: "'install' | 'add' | 'exec'", default: "'install'" },
            { property: "dev", description: "Add the dev-dependency flag (-D / --save-dev)", type: "boolean", default: "false" },
            { property: "value / defaultValue / onChange", description: "Controlled selected tab", type: "PackageManager / (mgr: PackageManager) => void", default: "-" },
            { property: "storageKey", description: "Where the choice is remembered; false disables it", type: "string | false", default: "'kkui-package-manager'" },
          ],
        },
      ]}
      related={[{ path: "/components/tabs", title: "Tabs" }]}
    />
  );
}
