import { Slider } from "@/components/ui/slider";

export default function Demo() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div>
        <p className="mb-4 text-xs text-text-tertiary">Tooltip always visible:</p>
        <Slider tooltip={{ open: true }} defaultValue={30} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Tooltip hidden:</p>
        <Slider tooltip={{ open: false }} defaultValue={50} />
      </div>
    </div>
  );
}
