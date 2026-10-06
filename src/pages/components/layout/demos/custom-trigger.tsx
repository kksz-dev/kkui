import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, User, Video, Upload } from "lucide-react";
import { Layout, LayoutHeader, LayoutSider, LayoutContent } from "@/components/ui/layout";

const items = [
  { icon: User, label: "nav 1" },
  { icon: Video, label: "nav 2" },
  { icon: Upload, label: "nav 3" },
];

export default function Demo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="min-h-[400px] overflow-hidden rounded-lg">
      <LayoutSider trigger={null} collapsible collapsed={collapsed}>
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
        <LayoutHeader className="bg-bg-container! p-0">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sider"
            className="flex size-16 items-center justify-center text-text transition-colors hover:bg-fill-tertiary"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </LayoutHeader>
        <LayoutContent className="m-6 min-h-[280px] rounded-lg bg-bg-container p-6">Content</LayoutContent>
      </Layout>
    </Layout>
  );
}
