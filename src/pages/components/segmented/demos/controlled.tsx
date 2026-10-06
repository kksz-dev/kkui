import * as React from "react";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [value, setValue] = React.useState<string | number>("Map");

  return (
    <div className="space-y-4">
      <Segmented
        value={value}
        onChange={(val) => setValue(val)}
        options={["Map", "Transit", "Satellite"]}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setValue("Map")}>
          Set to Map
        </Button>
        <Button size="sm" onClick={() => setValue("Satellite")}>
          Set to Satellite
        </Button>
      </div>
    </div>
  );
}
