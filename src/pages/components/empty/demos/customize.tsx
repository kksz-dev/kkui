import { Empty } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export default function Customize() {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={
        <span>
          Customize <a href="#api" className="text-primary hover:underline">Description</a>
        </span>
      }
    >
      <Button type="primary">Create Now</Button>
    </Empty>
  );
}
