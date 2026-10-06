import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";
import { Lock, User } from "lucide-react";

export default function Demo() {
  return (
    <Form layout="inline" onFinish={(values) => message.success(`Welcome ${String(values.username)}`)}>
      <Form.Item name="username" rules={[{ required: true, message: "Please input your username" }]}>
        <Input prefix={<User className="size-4 text-text-tertiary" />} placeholder="Username" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: "Please input your password" }]}>
        <Input.Password prefix={<Lock className="size-4 text-text-tertiary" />} placeholder="Password" />
      </Form.Item>

      <Form.Item shouldUpdate>
        {(form) => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(["username", "password"], true) ||
              form.getFieldsError().some(({ errors }) => errors.length > 0)
            }
          >
            Log in
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
