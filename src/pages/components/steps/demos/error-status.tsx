import { Steps } from "@/components/ui/steps";

export default function ErrorStatusDemo() {
  return (
    <Steps
      current={1}
      status="error"
      items={[
        {
          title: "Finished",
          description: "This is a description",
        },
        {
          title: "In Process",
          description: "This is a description",
        },
        {
          title: "Waiting",
          description: "This is a description",
        },
      ]}
    />
  );
}
