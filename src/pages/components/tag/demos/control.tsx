import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Tag } from "@/components/ui/tag";

export default function Demo() {
  const [tags, setTags] = useState(["Unremovable", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputVisible) inputRef.current?.focus();
  }, [inputVisible]);

  const confirm = () => {
    if (inputValue && !tags.includes(inputValue)) setTags([...tags, inputValue]);
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <Tag
          key={tag}
          closable={i !== 0}
          onClose={(e) => {
            e.preventDefault();
            setTags(tags.filter((t) => t !== tag));
          }}
        >
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={confirm}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          className="h-[22px] w-20 rounded-sm border border-border bg-bg-container px-1.5 text-xs outline-none focus:border-primary"
        />
      ) : (
        <Tag icon={<Plus />} onClick={() => setInputVisible(true)} className="border-dashed bg-bg-container">
          New Tag
        </Tag>
      )}
    </div>
  );
}
