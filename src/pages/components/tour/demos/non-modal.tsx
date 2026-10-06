import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function NonModalDemo() {
  const [open, setOpen] = React.useState(false);
  const targetRef = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Non-Modal Tour",
      description: "This step does not have a background dark mask overlay.",
      target: targetRef,
      mask: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button type="primary" onClick={() => setOpen(true)}>
          Show Non-Modal Tour
        </Button>
        <Button ref={targetRef}>Target Element</Button>
      </div>

      <Tour open={open} onClose={() => setOpen(false)} steps={steps} mask={false} />
    </div>
  );
}
