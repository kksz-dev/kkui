import { Card } from "@/components/ui/card";

export default function Demo() {
  return (
    <Card title="Card Title" className="w-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <Card.Grid key={i} hoverable={i !== 1}>
          Content
        </Card.Grid>
      ))}
    </Card>
  );
}
