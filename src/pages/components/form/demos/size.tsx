import { useState } from "react";
import { Form, type FormSize } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Radio } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [size, setSize] = useState<FormSize>("md");

  return (
    <div className="space-y-4">
      <Radio.Group
        value={size}
        onChange={(e) => setSize(e.target.value as FormSize)}
        optionType="button"
        options={[
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ]}
      />

      <Form size={size} layout="vertical" className="max-w-md">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Your name" />
        </Form.Item>

        <Form.Item name="role" label="Role">
          <Select
            placeholder="Pick a role"
            options={[
              { value: "dev", label: "Developer" },
              { value: "ops", label: "Operations" },
              { value: "pm", label: "Product manager" },
            ]}
          />
        </Form.Item>

        <Form.Item name="joined" label="Joined">
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
