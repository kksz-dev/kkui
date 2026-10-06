import * as React from "react";
import { List, ListItem } from "@/components/ui/list";
import { RadioGroup } from "@/components/ui/radio";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

export default function Demo() {
  const [size, setSize] = React.useState<"small" | "default" | "large">("default");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary">Size:</span>
        <RadioGroup
          value={size}
          onChange={(e) => setSize(e.target.value as "small" | "default" | "large")}
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "Small", value: "small" },
            { label: "Default", value: "default" },
            { label: "Large", value: "large" },
          ]}
        />
      </div>

      <List
        size={size}
        header={<div className="font-semibold text-text-heading">Header</div>}
        footer={<div className="text-text-secondary">Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <ListItem>
            <span className="font-medium text-text">{item}</span>
          </ListItem>
        )}
      />
    </div>
  );
}
