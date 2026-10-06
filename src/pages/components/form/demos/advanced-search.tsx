import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Demo() {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  const count = expand ? 9 : 6;

  return (
    <Form
      form={form}
      name="advanced-search"
      layout="vertical"
      onFinish={(values) => message.success(`Search: ${JSON.stringify(values)}`)}
    >
      <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_item, index) => (
          <Form.Item
            key={index}
            name={`field-${index}`}
            label={`Field ${index + 1}`}
            rules={[{ required: index === 0, message: "This field is required" }]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="primary" htmlType="submit">
          Search
        </Button>
        <Button onClick={() => form.resetFields()}>Clear</Button>
        <Button
          type="link"
          icon={expand ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          iconPosition="end"
          onClick={() => setExpand(!expand)}
        >
          {expand ? "Collapse" : "Expand"}
        </Button>
      </div>
    </Form>
  );
}
