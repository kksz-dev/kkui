import { Tag } from "@/components/ui/tag";

export default function Demo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm text-text-secondary">Presets</div>
        <div className="flex flex-wrap gap-2">
          <Tag color="magenta">magenta</Tag>
          <Tag color="red">red</Tag>
          <Tag color="volcano">volcano</Tag>
          <Tag color="orange">orange</Tag>
          <Tag color="gold">gold</Tag>
          <Tag color="lime">lime</Tag>
          <Tag color="green">green</Tag>
          <Tag color="cyan">cyan</Tag>
          <Tag color="blue">blue</Tag>
          <Tag color="geekblue">geekblue</Tag>
          <Tag color="purple">purple</Tag>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm text-text-secondary">Custom</div>
        <div className="flex flex-wrap gap-2">
          <Tag color="#f50">#f50</Tag>
          <Tag color="#2db7f5">#2db7f5</Tag>
          <Tag color="#87d068">#87d068</Tag>
          <Tag color="#108ee9">#108ee9</Tag>
        </div>
      </div>
    </div>
  );
}
