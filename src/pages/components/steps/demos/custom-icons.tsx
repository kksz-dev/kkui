import { Steps } from "@/components/ui/steps";

export default function CustomIconsDemo() {
  return (
    <Steps
      current={1}
      progressDot={(dot, { index, status, title }) => (
        <span className="relative flex cursor-pointer items-center justify-center">
          {dot}
          <span className="sr-only">{`Step ${index + 1} (${status}): ${String(title)}`}</span>
        </span>
      )}
      items={[
        {
          title: "Finished",
          description: "You can hover on the dot.",
        },
        {
          title: "In Progress",
          description: "You can hover on the dot.",
        },
        {
          title: "Waiting",
          description: "You can hover on the dot.",
        },
        {
          title: "Waiting",
          description: "You can hover on the dot.",
        },
      ]}
    />
  );
}
