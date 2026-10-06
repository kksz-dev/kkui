import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

export default function CustomDemo() {
  return (
    <Timeline
      items={[
        {
          children: "Create a services site 2015-09-01",
          dot: <CheckCircle2 className="size-3.5 text-success" />,
        },
        {
          children: "Solve initial network problems 2015-09-01",
          dot: <Sparkles className="size-3.5 text-warning" />,
        },
        {
          children: "Technical testing 2015-09-01",
          dot: <Clock className="size-3.5 text-error" />,
        },
        {
          children: "Network problems being solved 2015-09-01",
        },
      ]}
    />
  );
}
