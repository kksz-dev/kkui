import { Layout, LayoutHeader, LayoutContent, LayoutFooter } from "@/components/ui/layout";

const items = ["nav 1", "nav 2", "nav 3", "nav 4", "nav 5"];

export default function Demo() {
  return (
    <Layout className="overflow-hidden rounded-lg">
      <LayoutHeader className="gap-6">
        <div className="h-8 w-28 rounded-md bg-white/20" />
        <ul className="flex flex-1 items-center gap-1 text-white/65">
          {items.map((it, i) => (
            <li key={it} className={`cursor-pointer rounded-md px-4 py-1.5 leading-normal transition-colors hover:text-white ${i === 1 ? "bg-primary text-white" : ""}`}>
              {it}
            </li>
          ))}
        </ul>
      </LayoutHeader>
      <LayoutContent className="px-12">
        <nav className="my-4 flex gap-1 text-text-tertiary">
          <span>Home</span><span>/</span><span>List</span><span>/</span><span className="text-text">App</span>
        </nav>
        <div className="min-h-[280px] rounded-lg bg-bg-container p-6">Content</div>
      </LayoutContent>
      <LayoutFooter className="text-center">KKUI ©{new Date().getFullYear()} Created by KK</LayoutFooter>
    </Layout>
  );
}
