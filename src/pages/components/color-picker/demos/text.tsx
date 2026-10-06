import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ColorPicker defaultValue="#1677ff" showText />
      <ColorPicker
        defaultValue="#52c41a"
        showText={(color) => <span>Color: {color}</span>}
      />
    </div>
  );
}
