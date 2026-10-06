import { Settings, Pencil, Ellipsis } from "lucide-react";
import { Card, CardMeta } from "@/components/ui/card";

export default function Demo() {
  return (
    <Card
      className="w-[300px]"
      cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
      actions={[<Settings key="setting" />, <Pencil key="edit" />, <Ellipsis key="ellipsis" />]}
    >
      <CardMeta
        avatar={<img className="size-8 rounded-full" alt="" src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
        title="Card title"
        description="This is the description"
      />
    </Card>
  );
}
