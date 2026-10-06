import { useState } from "react";
import { Plus } from "lucide-react";
import { Tag } from "@/components/ui/tag";

export default function Demo() {
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [next, setNext] = useState(4);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          closable
          onClose={(e) => {
            e.preventDefault();
            setTags(tags.filter((t) => t !== tag));
          }}
          className="animate-in fade-in-0 zoom-in-90 duration-mid"
        >
          {tag}
        </Tag>
      ))}
      <Tag
        icon={<Plus />}
        className="cursor-pointer border-dashed bg-bg-container"
        onClick={() => {
          setTags([...tags, `Tag ${next}`]);
          setNext(next + 1);
        }}
      >
        New Tag
      </Tag>
    </div>
  );
}
