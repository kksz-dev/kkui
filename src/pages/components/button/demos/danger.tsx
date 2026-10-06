import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="primary" danger>Primary</Button>
      <Button danger>Default</Button>
      <Button type="dashed" danger>Dashed</Button>
      <Button type="text" danger>Text</Button>
      <Button type="link" danger>Link</Button>
    </div>
  );
}
