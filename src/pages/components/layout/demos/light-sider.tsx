import { PieChart, Monitor, User, Users, FileText } from "lucide-react";
import { Layout, LayoutHeader, LayoutSider, LayoutContent } from "@/components/ui/layout";

const items = [PieChart, Monitor, User, Users, FileText];

export default function Demo() {
  return (
    <Layout className="min-h-[360px] overflow-hidden rounded-lg">
      <LayoutSider theme="light" collapsible defaultCollapsed>
        <div className="m-4 h-8 rounded-md bg-fill-secondary" />
        <ul className="px-1 text-sm">
          {items.map((Icon, i) => (
            <li key={i} className={`mb-1 flex h-10 cursor-pointer items-center justify-center rounded-md transition-colors ${i === 0 ? "bg-primary-bg text-primary" : "text-text hover:bg-fill-tertiary"}`}>
              <Icon className="size-4" />
            </li>
          ))}
        </ul>
      </LayoutSider>
      <Layout>
        <LayoutHeader className="bg-bg-container! p-0" />
        <LayoutContent className="m-6 min-h-[200px] rounded-lg bg-bg-container p-6">Light theme sider, collapsed by default.</LayoutContent>
      </Layout>
    </Layout>
  );
}
