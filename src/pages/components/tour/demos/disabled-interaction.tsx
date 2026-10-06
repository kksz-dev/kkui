import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function DisabledInteractionDemo() {
  const [open, setOpen] = React.useState(false);
  const targetRef = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Disabled Interaction",
      description: "Target elements are protected during this step and cannot be clicked.",
      target: targetRef,
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Start Locked Tour
      </Button>

      <div>
        <Button ref={targetRef} onClick={() => alert("Clicked target!")}>
          Protected Action Button
        </Button>
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        disabledInteraction
      />
    </div>
  );
}
