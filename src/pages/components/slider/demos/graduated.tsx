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
    <div className="flex flex-col gap-10 pb-2">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">included=true (default)</p>
        <Slider marks={marks} defaultValue={37} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">included=false — no filled track</p>
        <Slider marks={marks} included={false} defaultValue={37} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">range with marks</p>
        <Slider range marks={marks} defaultValue={[26, 37]} />
      </div>
    </div>
  );
}
