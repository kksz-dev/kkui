import { Descriptions, type DescriptionsItemType } from "@/components/ui/descriptions";

const items: DescriptionsItemType[] = [
  {
    key: "1",
    label: "Custom Label",
    labelStyle: { color: "#1677ff", fontWeight: 600 },
    contentStyle: { color: "#52c41a", fontWeight: 600 },
    children: "Green Custom Content",
  },
  {
    key: "2",
    label: "Telephone",
    children: "1810000000",
  },
  {
    key: "3",
    label: "Live",
    children: "Hangzhou, Zhejiang",
  },
  {
    key: "4",
    label: "Remark",
    children: "empty",
  },
];

export default function Demo() {
  return (
    <Descriptions
      title="Custom Style"
      bordered
      labelStyle={{ width: "160px" }}
      items={items}
    />
  );
}
