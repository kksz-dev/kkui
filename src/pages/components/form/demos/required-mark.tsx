import { useState } from "react";
import { Form, type RequiredMark } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";

const MARKS: Record<string, RequiredMark> = {
  default: true,
  optional: "optional",
  hidden: false,
  custom: (label, { required }) => (
    <span className="inline-flex items-center gap-1">
      {label}
      <span className={required ? "text-xs text-error" : "text-xs text-text-tertiary"}>
        {required ? "required" : "optional"}
      </span>
    </span>
  ),
};

export default function Demo() {
  const [mark, setMark] = useState("default");

  return (
    <div className="space-y-4">
      <Radio.Group
        value={mark}
        onChange={(e) => setMark(String(e.target.value))}
        optionType="button"
        options={[
          { label: "Default", value: "default" },
          { label: "Optional", value: "optional" },
          { label: "Hidden", value: "hidden" },
          { label: "Custom", value: "custom" },
        ]}
      />

      <Form requiredMark={MARKS[mark]} layout="vertical" className="max-w-md">
        <Form.Item name="required" label="Required field" rules={[{ required: true }]}>
          <Input placeholder="Has a required rule" />
        </Form.Item>

        <Form.Item name="optional" label="Optional field">
          <Input placeholder="No rules at all" />
        </Form.Item>
      </Form>
    </div>
  );
}
