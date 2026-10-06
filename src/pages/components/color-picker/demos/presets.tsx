import { ColorPicker } from "@/components/ui/color-picker";

const presets = [
  {
    label: "Recommended",
    colors: [
      "#000000",
      "#000000E0",
      "#000000A6",
      "#00000073",
      "#00000040",
      "#00000026",
      "#00000014",
      "#0000000A",
      "#ffffff",
    ],
  },
  {
    label: "KKUI Brand",
    colors: [
      "#f5222d",
      "#fa541c",
      "#fa8c16",
      "#faad14",
      "#a0d911",
      "#52c41a",
      "#13c2c2",
      "#1677ff",
      "#2f54eb",
      "#722ed1",
      "#eb2f96",
    ],
  },
];

export default function Demo() {
  return <ColorPicker presets={presets} defaultValue="#1677ff" showText />;
}
