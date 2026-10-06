import { Clock } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

export default function RightDemo() {
  return (
    <Timeline
      mode="right"
      items={[
        {
          children: "Create a services site 2015-09-01",
        },
        {
          children: "Solve initial network problems 2015-09-01",
        },
        {
          dot: <Clock className="size-3.5 text-error" />,
          color: "red",
          children: "Technical testing 2015-09-01",
        },
        {
          children: "Network problems being solved 2015-09-01",
        },
      ]}
    />
  );
}
