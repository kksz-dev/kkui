import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ColorPicker disabled defaultValue="#1677ff" showText />
      <ColorPicker disabledAlpha defaultValue="#eb2f96" showText />
    </div>
  );
}
