import { Slider } from "@/components/ui/slider";

const marks = {
  0: "0°C",
  26: "26°C",
  37: "37°C",
  100: {
    style: {
      color: "var(--kk-error)",
      fontWeight: "bold",
    },
    label: "100°C",
  },
};

export default function Demo() {
  return (
    <div className="flex h-64 items-center justify-around">
      <Slider vertical defaultValue={30} />
      <Slider vertical range defaultValue={[20, 50]} />
      <Slider vertical range marks={marks} defaultValue={[26, 37]} />
    </div>
  );
}
