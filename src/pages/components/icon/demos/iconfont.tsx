import { createFromIconfontCN } from "@/components/ui/icon";

// The script injects an SVG symbol sprite into the document; every icon is then
// rendered as <svg><use xlinkHref="#icon-xxx" /></svg>.
const MyIcon = createFromIconfontCN({
  scriptUrl: "https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});

export default function IconfontDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <MyIcon type="icon-facebook" size={28} className="text-blue" />
      <MyIcon type="icon-twitter" size={28} className="text-cyan" />
      <MyIcon type="icon-github" size={28} className="text-text" />
      <MyIcon type="icon-weibo" size={28} spin className="text-error" />
    </div>
  );
}
