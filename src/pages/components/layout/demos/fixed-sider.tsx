import { AppWindow, BarChart2, Cloud, ShoppingCart, Upload, User, Users, Video } from "lucide-react";
import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from "@/components/ui/layout";

const items = [User, Video, Upload, BarChart2, Cloud, AppWindow, Users, ShoppingCart];

export default function Demo() {
  return (
    <div className="kk-scrollbar relative h-[400px] overflow-auto rounded-lg">
      <Layout hasSider className="min-h-[800px]">
        <LayoutSider className="sticky top-0 h-[400px] overflow-auto">
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
          <LayoutContent className="mx-4 my-6 overflow-hidden">
            <div className="rounded-lg bg-bg-container p-6 text-center">
              {Array.from({ length: 30 }, (_, i) => (
                <p key={i}>{i % 4 === 0 ? "long content ..." : ""}</p>
              ))}
            </div>
          </LayoutContent>
          <LayoutFooter className="text-center">KKUI ©{new Date().getFullYear()} Created by KK</LayoutFooter>
        </Layout>
      </Layout>
    </div>
  );
}
