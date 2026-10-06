import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  const [form] = Form.useForm();
  const [nicknameRequired, setNicknameRequired] = useState(false);

  // rules are plain props: flipping the flag re-validates with the new rule set
  useEffect(() => {
    form.validateFields(["nickname"]).catch(() => undefined);
  }, [form, nicknameRequired]);

  return (
    <Form
      form={form}
      layout="vertical"
      className="max-w-md"
      onFinish={(values) => message.success(`Submit: ${JSON.stringify(values)}`)}
    >
      <Form.Item name="username" label="Name" rules={[{ required: true, message: "Please input your name" }]}>
        <Input placeholder="Please input your name" />
      </Form.Item>

      <Form.Item
        name="nickname"
        label="Nickname"
        rules={[{ required: nicknameRequired, message: "Please input your nickname" }]}
      >
        <Input placeholder="Please input your nickname" />
      </Form.Item>

      <Form.Item>
        <Checkbox checked={nicknameRequired} onChange={(e) => setNicknameRequired(e.target.checked)}>
          Nickname is required
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <div className="flex gap-2">
          <Button type="primary" htmlType="submit">
            Check
          </Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </div>
      </Form.Item>
    </Form>
  );
}
