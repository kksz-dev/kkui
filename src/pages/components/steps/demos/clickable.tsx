import * as React from "react";
import { Steps } from "@/components/ui/steps";

export default function ClickableDemo() {
  const [current, setCurrent] = React.useState(0);

  return (
    <Steps
      current={current}
      onChange={setCurrent}
      items={[
        {
          title: "Step 1",
          description: "This is a description.",
        },
        {
          title: "Step 2",
          description: "This is a description.",
        },
        {
          title: "Step 3",
          description: "This is a description.",
        },
      ]}
    />
  );
}
