import { Tabs } from "@/components/ui/tabs";

const items = Array.from({ length: 30 }, (_, i) => ({
  key: String(i + 1),
  label: `Tab ${i + 1}`,
  children: `Content of Tab Pane ${i + 1}`,
}));

export default function SlideDemo() {
  return (
    <div className="max-w-[480px]">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
