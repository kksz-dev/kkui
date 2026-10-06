import { Form, type ValidateMessages } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

const validateMessages: ValidateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
    url: "${label} is not a valid url!",
  },
  number: { range: "${label} must be between ${min} and ${max}" },
};

export default function Demo() {
  return (
    <Form
      name="nest-messages"
      layout="vertical"
      className="max-w-md"
      validateMessages={validateMessages}
      onFinish={(values) => message.success(`Submit: ${JSON.stringify(values)}`)}
    >
      <Form.Item name={["user", "name"]} label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name={["user", "email"]} label="Email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>

      <Form.Item name={["user", "age"]} label="Age" rules={[{ type: "number", min: 0, max: 99 }]}>
        <InputNumber className="w-full" />
      </Form.Item>

      <Form.Item name={["user", "website"]} label="Website" rules={[{ type: "url" }]}>
        <Input placeholder="https://" />
      </Form.Item>

      <Form.Item name={["user", "intro"]} label="Introduction">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
