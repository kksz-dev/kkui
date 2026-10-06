import { Tag } from "@/components/ui/tag";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag>Tag 1</Tag>
      <Tag href="https://github.com/KKimSoulz" target="_blank">
        Link
      </Tag>
      <Tag closable onClose={(e) => e.preventDefault()}>
        Prevent Default
      </Tag>
      <Tag closable onClose={() => console.log("closed")}>
        Tag 2
      </Tag>
    </div>
  );
}
