import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function CustomIndicatorDemo() {
  const [open, setOpen] = React.useState(false);
  const ref1 = React.useRef<HTMLButtonElement>(null);
  const ref2 = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Step One",
      description: "First step with custom indicator text.",
      target: ref1,
    },
    {
      title: "Step Two",
      description: "Second step showing current progress.",
      target: ref2,
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Open with Custom Indicator
      </Button>

      <div className="flex gap-4">
        <Button ref={ref1}>First Button</Button>
        <Button ref={ref2}>Second Button</Button>
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span className="text-xs font-semibold text-primary">
            Step {current + 1} of {total}
          </span>
        )}
      />
    </div>
  );
}
