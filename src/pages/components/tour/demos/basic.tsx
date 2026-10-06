import * as React from "react";
import { Tour, type TourStep } from "@/components/ui/tour";
import { Button } from "@/components/ui/button";
import { Upload, Save, MoreHorizontal } from "lucide-react";

export default function BasicDemo() {
  const [open, setOpen] = React.useState(false);

  const ref1 = React.useRef<HTMLButtonElement>(null);
  const ref2 = React.useRef<HTMLButtonElement>(null);
  const ref3 = React.useRef<HTMLButtonElement>(null);

  const steps: TourStep[] = [
    {
      title: "Upload File",
      description: "Put your files here to start processing and analysis.",
      target: ref1,
    },
    {
      title: "Save Changes",
      description: "Save your work into your cloud account at any time.",
      target: ref2,
    },
    {
      title: "More Operations",
      description: "Click here to see more actions and advanced configurations.",
      target: ref3,
    },
  ];

  return (
    <div className="space-y-4">
      <Button type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </Button>

      <div className="flex flex-wrap items-center gap-4 pt-4">
        <Button ref={ref1} icon={<Upload className="size-4" />}>
          Upload
        </Button>
        <Button ref={ref2} icon={<Save className="size-4" />} type="primary">
          Save
        </Button>
        <Button ref={ref3} icon={<MoreHorizontal className="size-4" />}>
          More
        </Button>
      </div>

      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
