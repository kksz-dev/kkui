import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="register"
      layout="vertical"
      className="max-w-md"
      scrollToFirstError
      validateTrigger={["onChange", "onBlur"]}
      onFinish={(values) => message.success(`Registered: ${JSON.stringify(values)}`)}
    >
      <Form.Item
        name="email"
        label="E-mail"
        hasFeedback
        validateFirst
        rules={[
          { required: true, message: "Please input your e-mail" },
          { type: "email", message: "The input is not a valid e-mail" },
        ]}
      >
        <Input placeholder="you@example.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        hasFeedback
        validateFirst
        validateDebounce={300}
        rules={[
          { required: true, message: "Please input your password" },
          { min: 8, message: "Password must be at least 8 characters" },
          { pattern: /[A-Z]/, message: "Include at least one uppercase letter" },
        ]}
      >
        <Input.Password placeholder="At least 8 characters, one uppercase" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password" },
          (instance) => ({
            validator: (_rule, value) =>
              !value || instance.getFieldValue("password") === value
                ? Promise.resolve()
                : Promise.reject(new Error("The two passwords do not match")),
          }),
        ]}
      >
        <Input.Password placeholder="Repeat the password" />
      </Form.Item>

      <Form.Item
        name="nickname"
        label="Nickname"
        tooltip="What do you want others to call you?"
        rules={[{ required: true, whitespace: true, message: "Please input your nickname" }]}
      >
        <Input placeholder="Nickname" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone number"
        rules={[{ required: true, pattern: /^[0-9]{9,10}$/, message: "9 to 10 digits, numbers only" }]}
      >
        <Input addonBefore="+66" placeholder="812345678" />
      </Form.Item>

      <Form.Item name="website" label="Website" rules={[{ type: "url", message: "Please enter a valid URL" }]}>
        <Input placeholder="https://" />
      </Form.Item>

      <Form.Item
        name="donation"
        label="Monthly donation"
        extra="Optional — between 0 and 100"
        rules={[{ type: "number", min: 0, max: 100 }]}
      >
        <InputNumber className="w-full" addonAfter="THB" />
      </Form.Item>

      <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender" }]}>
        <Select
          placeholder="Select gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_rule, value) =>
              value ? Promise.resolve() : Promise.reject(new Error("Please accept the agreement")),
          },
        ]}
      >
        <Checkbox>I have read the agreement</Checkbox>
      </Form.Item>

      <Form.Item>
        <div className="flex gap-2">
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <Button htmlType="reset">Reset</Button>
        </div>
      </Form.Item>
    </Form>
  );
}
