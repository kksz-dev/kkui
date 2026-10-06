import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip title="Disabled buttons do not fire mouse events; wrap them in a span.">
        <span className="inline-block cursor-not-allowed">
          <Button disabled className="pointer-events-none">
            Disabled button
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Same trick for a disabled input.">
        <span className="inline-block cursor-not-allowed">
          <input disabled className="pointer-events-none h-control rounded-md border border-border bg-bg-container-disabled px-3 text-sm" placeholder="disabled input" />
        </span>
      </Tooltip>
    </div>
  );
}
