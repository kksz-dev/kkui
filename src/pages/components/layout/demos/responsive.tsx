import { User, Video, Upload, BarChart2 } from "lucide-react";
import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from "@/components/ui/layout";

const items = [User, Video, Upload, BarChart2];

export default function Demo() {
  return (
    <Layout className="min-h-[400px] overflow-hidden rounded-lg">
      <LayoutSider
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => console.log(broken)}
        onCollapse={(collapsed, type) => console.log(collapsed, type)}
      >
        <div className="m-4 h-8 rounded-md bg-white/20" />
        <ul className="px-1 text-sm text-white/65">
          {items.map((Icon, i) => (
            <li key={i} className={`mb-1 flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-4 whitespace-nowrap transition-colors hover:text-white ${i === 3 ? "bg-primary text-white" : ""}`}>
              <Icon className="size-4 shrink-0" />nav {i + 1}
            </li>
          ))}
        </ul>
      </LayoutSider>
      <Layout>
        <LayoutHeader className="bg-bg-container! p-0" />
        <LayoutContent className="m-6 mb-0">
          <div className="min-h-[240px] rounded-lg bg-bg-container p-6">content</div>
        </LayoutContent>
        <LayoutFooter className="text-center">KKUI ©{new Date().getFullYear()} Created by KK</LayoutFooter>
      </Layout>
    </Layout>
  );
}
