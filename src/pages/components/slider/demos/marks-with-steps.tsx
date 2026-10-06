import { Slider } from "@/components/ui/slider";

const marks = {
  0: "0",
  20: "20",
  40: "40",
  60: "60",
  80: "80",
  100: "100",
};

export default function Demo() {
  return (
    <div className="flex flex-col gap-10 pb-2">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">step=10 — free between marks</p>
        <Slider marks={marks} step={10} defaultValue={30} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">step=null — only marks are selectable</p>
        <Slider marks={marks} step={null} defaultValue={40} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">dots — a dot on every step point</p>
        <Slider marks={marks} step={20} dots defaultValue={[20, 60]} range />
      </div>
    </div>
  );
}
