import { Steps } from "@/components/ui/steps";

export default function LabelPlacementDemo() {
  return (
    <Steps
      current={1}
      labelPlacement="vertical"
      items={[
        {
          title: "Finished",
          description: "This is a description.",
        },
        {
          title: "In Progress",
          description: "This is a description.",
        },
        {
          title: "Waiting",
          description: "This is a description.",
        },
      ]}
    />
  );
}
