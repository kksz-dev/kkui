import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2 rounded-md bg-[rgb(190,200,200)] p-6">
      <Button type="primary" ghost>Primary</Button>
      <Button ghost>Default</Button>
      <Button type="dashed" ghost>Dashed</Button>
      <Button type="primary" danger ghost>Danger</Button>
    </div>
  );
}
