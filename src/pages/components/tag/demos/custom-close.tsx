import { CircleX, Trash2 } from "lucide-react";
import { Tag } from "@/components/ui/tag";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag closable={{ closeIcon: <CircleX /> }}>Tag 1</Tag>
      <Tag color="purple" closable={{ closeIcon: <Trash2 /> }}>Tag 2</Tag>
      <Tag color="#f50" closable={{ closeIcon: <span className="text-[10px] leading-none">×</span> }}>Tag 3</Tag>
    </div>
  );
}
