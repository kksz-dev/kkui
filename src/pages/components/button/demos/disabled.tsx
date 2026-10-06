import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="primary">Primary</Button>
        <Button type="primary" disabled>Primary(disabled)</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button disabled>Default(disabled)</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="dashed">Dashed</Button>
        <Button type="dashed" disabled>Dashed(disabled)</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="text">Text</Button>
        <Button type="text" disabled>Text(disabled)</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="link">Link</Button>
        <Button type="link" disabled>Link(disabled)</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button danger>Danger Default</Button>
        <Button danger disabled>Danger Default(disabled)</Button>
      </div>
      <div className="flex flex-wrap gap-2 rounded-md bg-fill-secondary p-2">
        <Button ghost>Ghost</Button>
        <Button ghost disabled>Ghost(disabled)</Button>
      </div>
    </div>
  );
}
