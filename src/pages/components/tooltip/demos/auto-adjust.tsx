import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export default function Demo() {
  return (
    <div className="h-40 overflow-auto rounded-md border border-border-secondary bg-bg-layout p-2">
      <div className="h-[420px] w-[720px] pt-24 pl-24">
        <Tooltip placement="topLeft" title="Adjusts automatically when there is no room in the placement direction">
          <Button>Adjust automatically / 自动调整</Button>
        </Tooltip>
        <br />
        <Tooltip placement="topLeft" title="Stays in place even when clipped" autoAdjustOverflow={false} className="mt-2">
          <Button className="mt-2">Ignore / 不处理</Button>
        </Tooltip>
      </div>
    </div>
  );
}
