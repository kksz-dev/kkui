import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

export default function Demo() {
  return (
    <Popover content={content} title="Title">
      <Button type="primary">Hover me</Button>
    </Popover>
  );
}
