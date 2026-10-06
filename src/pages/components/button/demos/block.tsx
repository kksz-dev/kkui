import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Button type="primary" block>Primary</Button>
      <Button block>Default</Button>
      <Button type="dashed" block>Dashed</Button>
      <Button disabled block>disabled</Button>
      <Button type="link" block>Link</Button>
    </div>
  );
}
