import { Space } from "@/components/ui/space";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Space size={[8, 16]} wrap>
      {Array.from({ length: 20 }, (_, i) => (
        <Button key={i}>Button</Button>
      ))}
    </Space>
  );
}
