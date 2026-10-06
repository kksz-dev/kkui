import { Descriptions, type DescriptionsItemType } from "@/components/ui/descriptions";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";

const items: DescriptionsItemType[] = [
  { key: "1", label: "User", children: <a className="text-primary hover:underline font-medium">Zhou Maomao</a> },
  { key: "2", label: "Role", children: <Tag color="blue">Administrator</Tag> },
  { key: "3", label: "Status", children: <Badge status="success" text="Online" /> },
  { key: "4", label: "Department", children: "Engineering / Frontend" },
  { key: "5", label: "Skills", span: 2, children: (
    <div className="flex gap-1.5 flex-wrap">
      <Tag color="cyan">React 19</Tag>
      <Tag color="purple">TypeScript</Tag>
      <Tag color="green">Tailwind CSS</Tag>
    </div>
  )},
  { key: "6", label: "Bio", span: 3, children: "Full-stack engineer building fast, responsive, and accessible UI component systems." },
];

export default function Demo() {
  return (
    <Descriptions title="Employee Profile" bordered items={items} />
  );
}
