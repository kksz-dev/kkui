import { useState } from "react";
import { Form, type FormLabelAlign } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";

export default function Demo() {
  const [span, setSpan] = useState(8);
  const [align, setAlign] = useState<FormLabelAlign>("right");
  const [colon, setColon] = useState(true);
  const [wrap, setWrap] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Radio.Group
          size="sm"
          value={span}
          onChange={(e) => setSpan(Number(e.target.value))}
          optionType="button"
          options={[
            { label: "span 4", value: 4 },
            { label: "span 8", value: 8 },
            { label: "span 12", value: 12 },
          ]}
        />
        <Radio.Group
          size="sm"
          value={align}
          onChange={(e) => setAlign(e.target.value as FormLabelAlign)}
          optionType="button"
          options={[
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ]}
        />
        <Checkbox checked={colon} onChange={(e) => setColon(e.target.checked)}>
          Colon
        </Checkbox>
        <Checkbox checked={wrap} onChange={(e) => setWrap(e.target.checked)}>
          Label wrap
        </Checkbox>
      </div>

      <Form
        labelCol={{ span }}
        wrapperCol={{ span: 24 - span }}
        labelAlign={align}
        colon={colon}
        labelWrap={wrap}
        className="max-w-lg"
      >
        <Form.Item name="short" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Short label" />
        </Form.Item>

        <Form.Item name="long" label="A very long label that needs wrapping">
          <Input placeholder="Long label" />
        </Form.Item>

        <Form.Item name="own" label="Own column" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
          <Input placeholder="This item overrides the form columns" />
        </Form.Item>
      </Form>
    </div>
  );
}
