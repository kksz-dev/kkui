import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";

export default function CoverDemo() {
  const [open, setOpen] = React.useState(false);
  const targetRef = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Rich Media Tour",
      description: "Steps can display cover images, banners, or video illustrations.",
      cover: (
        <img
          alt="Tour cover"
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
          className="h-36 w-full object-cover rounded-md"
        />
      ),
      target: targetRef,
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Show Cover Tour
      </Button>

      <div>
        <Button ref={targetRef}>Dashboard Widget</Button>
      </div>

      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
