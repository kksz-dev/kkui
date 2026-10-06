import * as React from "react";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";

export default function PendingReverseDemo() {
  const [reverse, setReverse] = React.useState(false);

  const handleClick = () => {
    setReverse(!reverse);
  };

  return (
    <div className="space-y-4">
      <Timeline
        pending="Recording..."
        reverse={reverse}
        items={[
          {
            children: "Create a services site 2015-09-01",
          },
          {
            children: "Solve initial network problems 2015-09-01",
          },
          {
            children: "Technical testing 2015-09-01",
          },
        ]}
      />
      <Button type="primary" onClick={handleClick}>
        Toggle Reverse
      </Button>
    </div>
  );
}
