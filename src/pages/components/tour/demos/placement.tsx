import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function PlacementDemo() {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Right Placement",
      description: "The tour card is positioned on the right side of the target.",
      target: btnRef,
      placement: "right",
    },
    {
      title: "Top Placement",
      description: "Now the card is positioned at the top.",
      target: btnRef,
      placement: "top",
    },
    {
      title: "Bottom Placement",
      description: "And now placed at the bottom.",
      target: btnRef,
      placement: "bottom",
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Start Placement Tour
      </Button>

      <div className="py-8 pl-12">
        <Button ref={btnRef}>Target Anchor</Button>
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        arrow={{ pointAtCenter: true }}
      />
    </div>
  );
}
