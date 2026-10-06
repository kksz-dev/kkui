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
    <div className="flex flex-wrap gap-2">
      <Popover content={content} title="Title" trigger="hover">
        <Button>Hover me</Button>
      </Popover>
      <Popover content={content} title="Title" trigger="focus">
        <Button>Focus me</Button>
      </Popover>
      <Popover content={content} title="Title" trigger="click">
        <Button>Click me</Button>
      </Popover>
    </div>
  );
}
