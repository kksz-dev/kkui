import { Card } from "@/components/ui/card";

export default function Demo() {
  return (
    <Card title="Default size card" extra={<a href="#" className="text-primary">More</a>} className="w-[300px]">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
}
