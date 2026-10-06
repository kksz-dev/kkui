import { Descriptions, type DescriptionsItemType } from "@/components/ui/descriptions";
import { Button } from "@/components/ui/button";

const items: DescriptionsItemType[] = [
  { key: "1", label: "UserName", children: "Zhou Maomao" },
  { key: "2", label: "Telephone", children: "1810000000" },
  { key: "3", label: "Live", children: "Hangzhou, Zhejiang" },
  { key: "4", label: "Remark", children: "empty" },
  { key: "5", label: "Address", children: "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China" },
];

export default function Demo() {
  return (
    <Descriptions
      title="User Info"
      extra={<Button type="primary" size="sm">Edit</Button>}
      items={items}
    />
  );
}
