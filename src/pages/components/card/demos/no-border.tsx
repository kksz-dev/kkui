import { Card } from "@/components/ui/card";

export default function Demo() {
  return (
    <div className="rounded-md bg-bg-layout p-6">
      <Card title="Card title" bordered={false} className="w-[300px]">
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
  );
}
