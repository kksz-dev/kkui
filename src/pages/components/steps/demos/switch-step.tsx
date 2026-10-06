import * as React from "react";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";

const steps = [
  {
    title: "First",
    content: "First-content: Setting up account information",
  },
  {
    title: "Second",
    content: "Second-content: Verifying identity & credentials",
  },
  {
    title: "Last",
    content: "Last-content: Reviewing and confirming submission",
  },
];

export default function SwitchStepDemo() {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="space-y-6">
      <Steps current={current} items={steps.map((s) => ({ title: s.title }))} />
      <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-border bg-fill-alter p-6 text-sm text-text-secondary">
        {steps[current].content}
      </div>
      <div className="flex gap-2">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => alert("Processing complete!")}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}
