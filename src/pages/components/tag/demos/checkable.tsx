import { useState } from "react";
import { CheckableTag } from "@/components/ui/tag";

const tagsData = ["Movies", "Books", "Music", "Sports"];

export default function Demo() {
  const [selected, setSelected] = useState<string[]>(["Books"]);

  const toggle = (tag: string, checked: boolean) =>
    setSelected(checked ? [...selected, tag] : selected.filter((t) => t !== tag));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-text-secondary">Categories:</span>
      {tagsData.map((tag) => (
        <CheckableTag key={tag} checked={selected.includes(tag)} onChange={(c) => toggle(tag, c)}>
          {tag}
        </CheckableTag>
      ))}
    </div>
  );
}
