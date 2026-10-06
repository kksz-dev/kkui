import * as React from "react";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [options, setOptions] = React.useState(["Daily", "Weekly", "Monthly"]);
  const [more, setMore] = React.useState(false);

  const handleToggle = () => {
    if (more) {
      setOptions(["Daily", "Weekly", "Monthly"]);
    } else {
      setOptions(["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]);
    }
    setMore(!more);
  };

  return (
    <div className="space-y-4">
      <Segmented options={options} />
      <div>
        <Button size="sm" onClick={handleToggle}>
          {more ? "Fewer Options" : "More Options"}
        </Button>
      </div>
    </div>
  );
}
