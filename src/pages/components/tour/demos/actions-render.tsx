import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function ActionsRenderDemo() {
  const [open, setOpen] = React.useState(false);
  const [visited, setVisited] = React.useState<number[]>([]);

  const ref1 = React.useRef<HTMLButtonElement>(null);
  const ref2 = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Custom Footer",
      description: "The footer is rebuilt around the default buttons.",
      target: ref1,
      // A caller-supplied onClick runs in addition to step navigation.
      nextButtonProps: { onClick: () => setVisited((v) => [...v, 1]) },
    },
    {
      title: "Still Navigable",
      description: "nextButtonProps.onClick fires and the tour still moves on.",
      target: ref2,
      nextButtonProps: { children: "Done", onClick: () => setVisited((v) => [...v, 2]) },
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => { setVisited([]); setOpen(true); }}>
        Start Tour
      </Button>

      <div className="flex gap-4">
        <Button ref={ref1}>Panel A</Button>
        <Button ref={ref2}>Panel B</Button>
      </div>

      <div className="text-sm text-text-secondary">
        Steps confirmed: {visited.length ? visited.join(", ") : "none yet"}
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        actionsRender={(originNode, { current, total }) => (
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-tertiary">
              {current + 1} / {total}
            </span>
            <Button size="sm" variant="text" onClick={() => setOpen(false)}>
              Skip
            </Button>
            {originNode}
          </div>
        )}
      />
    </div>
  );
}
