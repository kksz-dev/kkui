import { Icon } from "@/components/ui/icon";

const PandaSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
    <path d="M512 432c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z" />
  </svg>
);

const BOLT_PATH = "M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z";

export default function CustomSvgDemo() {
  return (
    <div className="flex items-center gap-6 text-3xl">
      <Icon component={PandaSvg} className="text-primary" />
      <Icon component={PandaSvg} rotate={90} className="text-success" />
      <Icon component={PandaSvg} spin className="text-error" />
      <Icon path={BOLT_PATH} className="text-warning" />
      <Icon path={BOLT_PATH} flip="horizontal" className="text-warning" />
    </div>
  );
}
