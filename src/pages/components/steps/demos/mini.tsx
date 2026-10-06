import { Steps } from "@/components/ui/steps";

export default function MiniDemo() {
  return (
    <Steps
      size="small"
      current={1}
      items={[
        {
          title: "Finished",
        },
        {
          title: "In Progress",
        },
        {
          title: "Waiting",
        },
      ]}
    />
  );
}
