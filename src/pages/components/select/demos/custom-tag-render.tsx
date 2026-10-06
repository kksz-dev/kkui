import { Select, type SelectProps } from "@/components/ui/select";
import { Tag } from "@/components/ui/tag";

const options: SelectProps["options"] = [{ value: "gold" }, { value: "lime" }, { value: "green" }, { value: "cyan" }];

const tagRender: SelectProps["tagRender"] = ({ label, value, closable, onClose }) => (
  <Tag
    color={String(value)}
    closable={closable}
    onClose={onClose}
    className="me-0"
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    {label}
  </Tag>
);

export default function Demo() {
  return <Select mode="multiple" tagRender={tagRender} defaultValue={["gold", "cyan"]} className="w-full" options={options} />;
}
