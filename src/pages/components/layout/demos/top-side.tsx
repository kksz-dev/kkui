import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from "@/components/ui/layout";
import { Laptop, Bell, User } from "lucide-react";

const groups = [
  { icon: User, label: "subnav 1", children: ["option1", "option2", "option3", "option4"] },
  { icon: Laptop, label: "subnav 2", children: ["option5", "option6", "option7", "option8"] },
  { icon: Bell, label: "subnav 3", children: ["option9", "option10", "option11", "option12"] },
];

export default function Demo() {
  return (
    <Layout className="overflow-hidden rounded-lg">
      <LayoutHeader className="gap-6">
        <div className="h-8 w-28 rounded-md bg-white/20" />
        <ul className="flex flex-1 items-center gap-1 text-white/65">
          {["nav 1", "nav 2", "nav 3"].map((it, i) => (
            <li key={it} className={`cursor-pointer rounded-md px-4 py-1.5 leading-normal transition-colors hover:text-white ${i === 1 ? "bg-primary text-white" : ""}`}>
              {it}
            </li>
          ))}
        </ul>
      </LayoutHeader>
      <LayoutContent className="px-12 py-0">
        <nav className="my-4 flex gap-1 text-text-tertiary">
          <span>Home</span><span>/</span><span>List</span><span>/</span><span className="text-text">App</span>
        </nav>
        <Layout className="rounded-lg bg-bg-container p-6">
          <LayoutSider theme="light" width={200}>
            <ul className="border-r border-border-secondary pr-2 text-sm">
              {groups.map((g, gi) => (
                <li key={g.label} className="mb-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-text"><g.icon className="size-4" />{g.label}</div>
                  <ul>
                    {g.children.map((c, ci) => (
                      <li key={c} className={`cursor-pointer rounded-md py-2 pl-12 transition-colors ${gi === 0 && ci === 0 ? "bg-primary-bg text-primary" : "text-text hover:bg-fill-tertiary"}`}>{c}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </LayoutSider>
          <LayoutContent className="min-h-[280px] px-6">Content</LayoutContent>
        </Layout>
      </LayoutContent>
      <LayoutFooter className="text-center">KKUI ©{new Date().getFullYear()} Created by KK</LayoutFooter>
    </Layout>
  );
}
