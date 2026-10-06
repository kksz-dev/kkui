import { Tag } from "@/components/ui/tag";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Tag bordered={false}>Tag 1</Tag>
        <Tag bordered={false}>Tag 2</Tag>
        <Tag bordered={false} closable>Tag 3</Tag>
        <Tag bordered={false} closable>Tag 4</Tag>
      </div>
      <div className="flex flex-wrap gap-2 rounded-md bg-bg-layout p-3">
        <Tag bordered={false} color="processing">processing</Tag>
        <Tag bordered={false} color="success">success</Tag>
        <Tag bordered={false} color="error">error</Tag>
        <Tag bordered={false} color="warning">warning</Tag>
        <Tag bordered={false} color="magenta">magenta</Tag>
        <Tag bordered={false} color="cyan">cyan</Tag>
        <Tag bordered={false} color="purple">purple</Tag>
      </div>
    </div>
  );
}
