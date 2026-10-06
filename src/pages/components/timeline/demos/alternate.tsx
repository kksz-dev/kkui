import { Clock } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

export default function AlternateDemo() {
  return (
    <Timeline
      mode="alternate"
      items={[
        {
          children: "Create a services site 2015-09-01",
        },
        {
          children: "Solve initial network problems 2015-09-01",
          color: "green",
        },
        {
          dot: <Clock className="size-3.5 text-primary" />,
          children: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
        },
        {
          color: "red",
          children: "Network problems being solved 2015-09-01",
        },
        {
          children: "Create a services site 2015-09-01",
        },
        {
          dot: <Clock className="size-3.5 text-primary" />,
          children: "Technical testing 2015-09-01",
        },
      ]}
    />
  );
}
