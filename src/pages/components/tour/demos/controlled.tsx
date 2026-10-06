import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function ControlledDemo() {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(0);

  const ref1 = React.useRef<HTMLButtonElement>(null);
  const ref2 = React.useRef<HTMLButtonElement>(null);
  const ref3 = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    { title: "Step 1: Initiation", description: "First operation item.", target: ref1 },
    { title: "Step 2: Processing", description: "Second operation item.", target: ref2 },
    { title: "Step 3: Verification", description: "Third operation item.", target: ref3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Controlled Tour
        </Button>
        <Button onClick={() => { setCurrent(0); setOpen(true); }}>Jump to Step 1</Button>
        <Button onClick={() => { setCurrent(1); setOpen(true); }}>Jump to Step 2</Button>
        <Button onClick={() => { setCurrent(2); setOpen(true); }}>Jump to Step 3</Button>
      </div>

      <div className="flex gap-4 pt-4">
        <Button ref={ref1}>Point 1</Button>
        <Button ref={ref2}>Point 2</Button>
        <Button ref={ref3}>Point 3</Button>
      </div>

      <Tour
        open={open}
        current={current}
        onChange={(idx) => setCurrent(idx)}
        onClose={() => setOpen(false)}
        steps={steps}
      />
    </div>
  );
}
