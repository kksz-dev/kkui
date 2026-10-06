import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Input placeholder="Outlined" />
      <Input placeholder="Filled" variant="filled" />
      <Input placeholder="Borderless" variant="borderless" />
      <Input placeholder="Underlined" variant="underlined" />
    </div>
  );
}
