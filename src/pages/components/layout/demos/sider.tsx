import { useState } from "react";
import { PieChart, Monitor, User, Users, FileText } from "lucide-react";
import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from "@/components/ui/layout";

const items = [
  { icon: PieChart, label: "Option 1" },
  { icon: Monitor, label: "Option 2" },
  { icon: User, label: "User" },
  { icon: Users, label: "Team" },
  { icon: FileText, label: "Files" },
];

export default function Demo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="min-h-[520px] overflow-hidden rounded-lg">
      <LayoutSider collapsible collapsed={collapsed} onCollapse={(v) => setCollapsed(v)}>
        <div className="m-4 h-8 rounded-md bg-white/20" />
        <ul className="px-1 text-sm text-white/65">
          {items.map((it, i) => (
            <li
              key={it.label}
              className={`mb-1 flex h-10 cursor-pointer items-center gap-2.5 overflow-hidden rounded-md px-4 whitespace-nowrap transition-colors hover:text-white ${i === 0 ? "bg-primary text-white" : ""} ${collapsed ? "justify-center px-0" : ""}`}
            >
              <it.icon className="size-4 shrink-0" />
              {!collapsed && it.label}
            </li>
          ))}
        </ul>
      </LayoutSider>
      <Layout>
        <LayoutHeader className="bg-bg-container! p-0" />
        <LayoutContent className="mx-4">
          <nav className="my-4 flex gap-1 text-text-tertiary">
            <span>User</span><span>/</span><span className="text-text">Bill</span>
          </nav>
          <div className="min-h-[360px] rounded-lg bg-bg-container p-6">Bill is a cat.</div>
        </LayoutContent>
        <LayoutFooter className="text-center">KKUI ©{new Date().getFullYear()} Created by KK</LayoutFooter>
      </Layout>
    </Layout>
  );
}
