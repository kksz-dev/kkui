import * as React from "react";
import { Steps } from "@/components/ui/steps";

export default function NavigationDemo() {
  const [current, setCurrent] = React.useState(0);

  return (
    <Steps
      type="navigation"
      size="small"
      current={current}
      onChange={setCurrent}
      items={[
        {
          title: "Step 1",
          subTitle: "00:00:05",
          status: "finish",
          description: "This is a description.",
        },
        {
          title: "Step 2",
          subTitle: "00:01:30",
          status: "process",
          description: "This is a description.",
        },
        {
          title: "Step 3",
          status: "wait",
          description: "This is a description.",
        },
      ]}
    />
  );
}
