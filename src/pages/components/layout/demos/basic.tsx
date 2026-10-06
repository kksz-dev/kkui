import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from "@/components/ui/layout";

const header = "text-center text-white bg-[#4096ff]! h-16 leading-[64px]";
const content = "text-center text-white bg-[#0958d9] min-h-[120px] leading-[120px]";
const sider = "text-center text-white bg-[#1677ff]! leading-[120px]";
const footer = "text-center text-white bg-[#4096ff]!";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4 [&>section]:overflow-hidden [&>section]:rounded-lg">
      <Layout>
        <LayoutHeader className={header}>Header</LayoutHeader>
        <LayoutContent className={content}>Content</LayoutContent>
        <LayoutFooter className={footer}>Footer</LayoutFooter>
      </Layout>

      <Layout>
        <LayoutHeader className={header}>Header</LayoutHeader>
        <Layout>
          <LayoutSider width="25%" className={sider}>Sider</LayoutSider>
          <LayoutContent className={content}>Content</LayoutContent>
        </Layout>
        <LayoutFooter className={footer}>Footer</LayoutFooter>
      </Layout>

      <Layout>
        <LayoutHeader className={header}>Header</LayoutHeader>
        <Layout>
          <LayoutContent className={content}>Content</LayoutContent>
          <LayoutSider width="25%" className={sider}>Sider</LayoutSider>
        </Layout>
        <LayoutFooter className={footer}>Footer</LayoutFooter>
      </Layout>

      <Layout>
        <LayoutSider width="25%" className={sider}>Sider</LayoutSider>
        <Layout>
          <LayoutHeader className={header}>Header</LayoutHeader>
          <LayoutContent className={content}>Content</LayoutContent>
          <LayoutFooter className={footer}>Footer</LayoutFooter>
        </Layout>
      </Layout>
    </div>
  );
}
