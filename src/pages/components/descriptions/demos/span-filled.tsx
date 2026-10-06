import { Descriptions, type DescriptionsItemType } from "@/components/ui/descriptions";

const items: DescriptionsItemType[] = [
  { key: "1", label: "UserName", children: "Zhou Maomao" },
  { key: "2", label: "Live", span: "filled", children: "Hangzhou, Zhejiang (Filled rest of the row)" },
  { key: "3", label: "Remark", span: "filled", children: "This remark takes the entire new row." },
];

export default function Demo() {
  return (
    <Descriptions title="Filled Spans" bordered column={3} items={items} />
  );
}
