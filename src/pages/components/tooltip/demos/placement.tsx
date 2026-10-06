import { Button } from "@/components/ui/button";
import { Tooltip, type TooltipPlacement } from "@/components/ui/tooltip";

const text = <span>prompt text</span>;

function P({ placement, label }: { placement: TooltipPlacement; label: string }) {
  return (
    <Tooltip placement={placement} title={text}>
      <Button className="w-[70px] px-0">{label}</Button>
    </Tooltip>
  );
}

export default function Demo() {
  return (
    <div className="grid w-[calc(70px*5+8px*4)] grid-cols-5 gap-2">
      <div />
      <P placement="topLeft" label="TL" />
      <P placement="top" label="Top" />
      <P placement="topRight" label="TR" />
      <div />
      <P placement="leftTop" label="LT" />
      <div className="col-span-3" />
      <P placement="rightTop" label="RT" />
      <P placement="left" label="Left" />
      <div className="col-span-3" />
      <P placement="right" label="Right" />
      <P placement="leftBottom" label="LB" />
      <div className="col-span-3" />
      <P placement="rightBottom" label="RB" />
      <div />
      <P placement="bottomLeft" label="BL" />
      <P placement="bottom" label="Bottom" />
      <P placement="bottomRight" label="BR" />
      <div />
    </div>
  );
}
