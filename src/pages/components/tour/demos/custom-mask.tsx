import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function CustomMaskDemo() {
  const [open, setOpen] = React.useState(false);
  const targetRef = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Custom Mask Color",
      description:
        "The backdrop is tinted, and clicking it does nothing — only the close icon or Finish ends the tour.",
      target: targetRef,
      mask: {
        color: "rgba(22, 119, 255, 0.25)",
        closable: false,
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Show Tinted Mask
      </Button>

      <div>
        <Button ref={targetRef}>Highlighted Element</Button>
      </div>

      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
