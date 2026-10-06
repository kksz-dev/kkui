import { ColorPicker } from "@/components/ui/color-picker";

export default function Demo() {
  return (
    <ColorPicker
      defaultValue="#722ed1"
      showText
      panelRender={(_, { components: { Picker, Presets } }) => (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-text">Custom Palette Panel</div>
          <Picker />
          <Presets />
        </div>
      )}
      presets={[
        {
          label: "Theme Colors",
          colors: ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"],
        },
      ]}
    />
  );
}
