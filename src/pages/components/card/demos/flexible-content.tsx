import { Card, CardMeta } from "@/components/ui/card";

export default function Demo() {
  return (
    <Card
      hoverable
      className="w-[240px]"
      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
      <CardMeta title="Europe Street beat" description="www.instagram.com" />
    </Card>
  );
}
