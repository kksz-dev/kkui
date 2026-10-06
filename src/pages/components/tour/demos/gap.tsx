import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function GapDemo() {
  const [open, setOpen] = React.useState(false);
  const targetRef = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Custom Gap & Radius",
      description: "The cutout mask has 16px offset padding and 16px rounded corners.",
      target: targetRef,
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Show Custom Gap
      </Button>

      <div>
        <Button ref={targetRef} size="lg">Large Target Button</Button>
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        gap={{ offset: 16, radius: 16 }}
      />
    </div>
  );
}
