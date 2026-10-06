import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <ColorPicker size="sm" defaultValue="#1677ff" />
      <ColorPicker size="md" defaultValue="#1677ff" />
      <ColorPicker size="lg" defaultValue="#1677ff" />
    </div>
  );
}
