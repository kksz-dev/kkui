import { Card } from "@/components/ui/card";

export default function Demo() {
  return (
    <Card title="Card title">
      <p className="mb-2 font-medium">Group title</p>
      <Card type="inner" title="Inner Card title" extra={<a href="#" className="text-primary">More</a>}>
        Inner Card content
      </Card>
      <Card type="inner" title="Inner Card title" extra={<a href="#" className="text-primary">More</a>} className="mt-4">
        Inner Card content
      </Card>
    </Card>
  );
}
