import { Steps } from "@/components/ui/steps";

export default function VerticalDemo() {
  return (
    <Steps
      direction="vertical"
      current={1}
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
