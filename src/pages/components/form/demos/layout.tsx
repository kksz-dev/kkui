import { useState } from "react";
import { Form, type FormLayout } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [layout, setLayout] = useState<FormLayout>("horizontal");
  const horizontal = layout === "horizontal";

  return (
    <Form
      layout={layout}
      className="max-w-xl"
      labelCol={horizontal ? { span: 6 } : undefined}
      wrapperCol={horizontal ? { span: 18 } : undefined}
      initialValues={{ layout: "horizontal" }}
      onValuesChange={(changed) => {
        if (changed.layout) setLayout(changed.layout as FormLayout);
      }}
    >
      <Form.Item name="layout" label="Layout">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
            { label: "Inline", value: "inline" },
          ]}
        />
      </Form.Item>

      <Form.Item name="fieldA" label="Field A">
        <Input placeholder="input placeholder" />
      </Form.Item>

      <Form.Item name="fieldB" label="Field B">
        <Input placeholder="input placeholder" />
      </Form.Item>

      <Form.Item wrapperCol={horizontal ? { span: 18, offset: 6 } : undefined}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
