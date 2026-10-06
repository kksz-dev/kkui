import { Space } from "@/components/ui/space";
import { Button } from "@/components/ui/button";

function Block({ children }: { children: React.ReactNode }) {
  return <span className="inline-block h-[90px] w-[90px] bg-primary/25 p-1 text-sm">{children}</span>;
}

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2 [&>*]:border [&>*]:border-dashed [&>*]:border-border [&>*]:p-2">
      <Space align="center">
        center
        <Button type="primary">Primary</Button>
        <Block>Block</Block>
      </Space>
      <Space align="start">
        start
        <Button type="primary">Primary</Button>
        <Block>Block</Block>
      </Space>
      <Space align="end">
        end
        <Button type="primary">Primary</Button>
        <Block>Block</Block>
      </Space>
      <Space align="baseline">
        baseline
        <Button type="primary">Primary</Button>
        <Block>Block</Block>
      </Space>
    </div>
  );
}
