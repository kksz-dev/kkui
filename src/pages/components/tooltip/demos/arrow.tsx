import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { Tooltip, type TooltipPlacement } from "@/components/ui/tooltip";

const text = <span>prompt text</span>;
const options = ["Show", "Hide", "Center"] as const;

function P({ placement, label, arrow }: { placement: TooltipPlacement; label: string; arrow: boolean | { pointAtCenter: true } }) {
  return (
    <Tooltip placement={placement} title={text} arrow={arrow}>
      <Button className="w-[70px] px-0">{label}</Button>
    </Tooltip>
  );
}

export default function Demo() {
  const [mode, setMode] = useState<(typeof options)[number]>("Show");
  const arrow = mode === "Hide" ? false : mode === "Center" ? { pointAtCenter: true as const } : true;
  return (
    <div className="space-y-6">
      <Segmented options={[...options]} value={mode} onChange={setMode} />
      <div className="grid w-[calc(70px*5+8px*4)] grid-cols-5 gap-2">
        <div />
        <P arrow={arrow} placement="topLeft" label="TL" />
        <P arrow={arrow} placement="top" label="Top" />
        <P arrow={arrow} placement="topRight" label="TR" />
        <div />
        <P arrow={arrow} placement="leftTop" label="LT" />
        <div className="col-span-3" />
        <P arrow={arrow} placement="rightTop" label="RT" />
        <P arrow={arrow} placement="left" label="Left" />
        <div className="col-span-3" />
        <P arrow={arrow} placement="right" label="Right" />
        <P arrow={arrow} placement="leftBottom" label="LB" />
        <div className="col-span-3" />
        <P arrow={arrow} placement="rightBottom" label="RB" />
        <div />
        <P arrow={arrow} placement="bottomLeft" label="BL" />
        <P arrow={arrow} placement="bottom" label="Bottom" />
        <P arrow={arrow} placement="bottomRight" label="BR" />
        <div />
      </div>
    </div>
  );
}
