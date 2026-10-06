import { Slider } from "@/components/ui/slider";

export default function Demo() {
  const formatter = (value?: number) => `${value}%`;

  return (
    <div className="flex flex-col gap-6">
      <Slider tooltip={{ formatter }} defaultValue={37} />
      <Slider tooltip={{ formatter: (val) => `${val} °C` }} defaultValue={24} min={-10} max={40} />
    </div>
  );
}
