import * as React from "react";
import { ConfigProvider, type ComponentSize } from "@/components/ui/config-provider";
import { Radio } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComponentSizeDemo() {
  const [size, setSize] = React.useState<ComponentSize>("md");

  return (
    <div className="flex flex-col gap-4">
      <Radio.Group
        value={size}
        onChange={(e) => setSize(e.target.value as ComponentSize)}
        options={[
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ]}
        optionType="button"
      />

      <ConfigProvider componentSize={size} applyToRoot={false}>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="primary" size={size}>
            Button
          </Button>
          <Input placeholder="Input" size={size} className="w-40" />
        </div>
      </ConfigProvider>
    </div>
  );
}
