import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { InputNumber } from "@/components/ui/input-number";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [disabled, setDisabled] = useState(true);

  return (
    <div className="space-y-4">
      <Checkbox checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>
        Form disabled
      </Checkbox>

      <Form
        disabled={disabled}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="max-w-md"
        initialValues={{ seats: 2, notify: true }}
      >
        <Form.Item name="project" label="Project">
          <Input placeholder="Project name" />
        </Form.Item>

        <Form.Item name="owner" label="Owner">
          <Select
            placeholder="Pick an owner"
            options={[
              { value: "ada", label: "Ada" },
              { value: "linus", label: "Linus" },
            ]}
          />
        </Form.Item>

        <Form.Item name="seats" label="Seats">
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item name="notify" label="Notify" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
