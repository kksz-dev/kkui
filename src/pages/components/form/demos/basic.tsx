import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  return (
    <Form
      name="basic"
      className="max-w-md"
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      initialValues={{ remember: true }}
      onFinish={(values) => message.success(`Submit: ${JSON.stringify(values)}`)}
      onFinishFailed={({ errorFields }) => message.error(`${errorFields.length} field(s) need attention`)}
    >
      <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input placeholder="Enter username" />
      </Form.Item>

      <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ span: 17, offset: 7 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 17, offset: 7 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
