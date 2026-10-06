import { Timeline } from "@/components/ui/timeline";

export default function LabelDemo() {
  return (
    <Timeline
      mode="left"
      items={[
        {
          label: "2015-09-01",
          children: "Create a services site",
        },
        {
          label: "2015-09-01 09:12:11",
          children: "Solve initial network problems",
        },
        {
          children: "Technical testing",
        },
        {
          label: "2015-09-01 09:12:11",
          children: "Network problems being solved",
        },
      ]}
    />
  );
}
