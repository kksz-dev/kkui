import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ColorPicker trigger="hover" defaultValue="#1677ff" showText />
      <span className="text-xs text-text-tertiary">Hover to trigger</span>
    </div>
  );
}
