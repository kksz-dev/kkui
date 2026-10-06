import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  return (
    <Form
      layout="vertical"
      className="max-w-md"
      onFinish={() => message.success("Passwords match — submitted")}
    >
      <Form.Item
        name="password"
        label="Password"
        hasFeedback
        validateFirst
        rules={[
          { required: true, message: "Please input your password" },
          { min: 8, message: "At least 8 characters" },
        ]}
      >
        <Input.Password placeholder="At least 8 characters" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password" },
          (form) => ({
            validator: (_rule, value) =>
              !value || form.getFieldValue("password") === value
                ? Promise.resolve()
                : Promise.reject(new Error("The two passwords do not match")),
          }),
        ]}
      >
        <Input.Password placeholder="Repeat the password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
