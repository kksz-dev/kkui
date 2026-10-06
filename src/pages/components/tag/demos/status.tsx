import { Tag, TagStatusIcon } from "@/components/ui/tag";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm text-text-secondary">Without icon</div>
        <div className="flex flex-wrap gap-2">
          <Tag color="success">success</Tag>
          <Tag color="processing">processing</Tag>
          <Tag color="error">error</Tag>
          <Tag color="warning">warning</Tag>
          <Tag color="default">default</Tag>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm text-text-secondary">With icon</div>
        <div className="flex flex-wrap gap-2">
          <Tag icon={<TagStatusIcon status="success" />} color="success">success</Tag>
          <Tag icon={<TagStatusIcon status="processing" />} color="processing">processing</Tag>
          <Tag icon={<TagStatusIcon status="error" />} color="error">error</Tag>
          <Tag icon={<TagStatusIcon status="warning" />} color="warning">warning</Tag>
          <Tag icon={<TagStatusIcon status="default" />} color="default">waiting</Tag>
        </div>
      </div>
    </div>
  );
}
