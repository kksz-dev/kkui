import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="control-hooks"
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      className="max-w-md"
      onFinish={(values) => message.success(`Submit: ${JSON.stringify(values)}`)}
    >
      <Form.Item name="note" label="Note" rules={[{ required: true }]}>
        <Input placeholder="Anything you like" />
      </Form.Item>

      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select
          allowClear
          placeholder="Select gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />
      </Form.Item>

      <Form.Item noStyle shouldUpdate={(prev, next) => prev.gender !== next.gender}>
        {({ getFieldValue }) =>
          getFieldValue("gender") === "other" ? (
            <Form.Item name="customGender" label="Custom gender" rules={[{ required: true }]}>
              <Input placeholder="Tell us more" />
            </Form.Item>
          ) : null
        }
      </Form.Item>

      <Form.Item wrapperCol={{ span: 17, offset: 7 }}>
        <div className="flex flex-wrap gap-2">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button onClick={() => form.setFieldsValue({ note: "Hello world!", gender: "male" })}>Fill form</Button>
          <Button type="link" onClick={() => message.info(`note = ${String(form.getFieldValue("note") ?? "-")}`)}>
            Read note
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
