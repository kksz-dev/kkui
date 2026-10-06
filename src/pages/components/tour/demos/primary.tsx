import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function PrimaryDemo() {
  const [open, setOpen] = React.useState(false);
  const ref1 = React.useRef<HTMLButtonElement>(null);
  const ref2 = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Primary Styled Tour",
      description: "In primary mode, the entire tour card uses solid brand primary color.",
      target: ref1,
    },
    {
      title: "Highlight Features",
      description: "Great for onboarding new users to key product innovations.",
      target: ref2,
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Start Primary Tour
      </Button>

      <div className="flex gap-4">
        <Button ref={ref1}>Feature A</Button>
        <Button ref={ref2}>Feature B</Button>
      </div>

      <Tour
        type="primary"
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
      />
    </div>
  );
}
