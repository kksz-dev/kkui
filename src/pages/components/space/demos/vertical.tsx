import { Space } from "@/components/ui/space";
import { Card } from "@/components/ui/card";

export default function Demo() {
  return (
    <Space direction="vertical" size="md" className="flex">
      <Card title="Card" size="small">
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card title="Card" size="small">
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  );
}
