import { Steps } from "@/components/ui/steps";

export default function BasicDemo() {
  return (
    <Steps
      current={1}
      items={[
        {
          title: "Finished",
          description: "This is a description.",
        },
        {
          title: "In Progress",
          subTitle: "Left 00:00:08",
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
