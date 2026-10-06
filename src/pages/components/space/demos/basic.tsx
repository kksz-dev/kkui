import { Space } from "@/components/ui/space";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Space>
      Space
      <Button type="primary">Button</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
    </Space>
  );
}
