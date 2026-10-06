import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ColorPicker format="rgb" defaultFormat="rgb" defaultValue="#1677ff" showText />
      <ColorPicker format="hsb" defaultFormat="hsb" defaultValue="#1677ff" showText />
      <ColorPicker disabledFormat defaultValue="#1677ff" showText />
    </div>
  );
}
