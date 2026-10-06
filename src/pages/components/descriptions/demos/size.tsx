import * as React from "react";
import { Descriptions, type DescriptionsItemType, type DescriptionsSize } from "@/components/ui/descriptions";
import { RadioGroup } from "@/components/ui/radio";

const items: DescriptionsItemType[] = [
  { key: "1", label: "Product", children: "Cloud Database" },
  { key: "2", label: "Billing", children: "Prepaid" },
  { key: "3", label: "time", children: "18:00:00" },
  { key: "4", label: "Amount", children: "$80.00" },
  { key: "5", label: "Discount", span: 2, children: "$20.00" },
  {
    key: "6",
    label: "Official",
    span: 3,
    children: "$60.00",
  },
];

export default function Demo() {
  const [size, setSize] = React.useState<DescriptionsSize>("default");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary">Size:</span>
        <RadioGroup
          value={size}
          onChange={(e) => setSize(e.target.value as DescriptionsSize)}
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "Default", value: "default" },
            { label: "Middle", value: "middle" },
            { label: "Small", value: "small" },
          ]}
        />
      </div>

      <Descriptions title="Bordered" bordered size={size} items={items} />

      <Descriptions title="Normal" size={size} items={items} />
    </div>
  );
}
