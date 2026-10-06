import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export default function Demo() {
  return (
    <Form
      name="dynamic-contacts"
      layout="vertical"
      initialValues={{ contacts: [{ name: "Ada", email: "ada@kkui.dev" }] }}
      onFinish={(values) => message.success(`Submit: ${JSON.stringify(values)}`)}
    >
      <Form.List name="contacts" rules={[{ type: "array", min: 1, message: "Keep at least one contact" }]}>
        {(fields, { add, remove, move }, { errors }) => (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.key} className="flex items-start gap-2">
                <Form.Item
                  name={[field.name, "name"]}
                  label={index === 0 ? "Name" : undefined}
                  rules={[{ required: true, message: "Name is required" }]}
                  className="flex-1"
                >
                  <Input placeholder="Contact name" />
                </Form.Item>

                <Form.Item
                  name={[field.name, "email"]}
                  label={index === 0 ? "E-mail" : undefined}
                  rules={[{ required: true, type: "email", message: "A valid e-mail is required" }]}
                  className="flex-1"
                >
                  <Input placeholder="name@example.com" />
                </Form.Item>

                <div className={index === 0 ? "flex gap-1 pt-7" : "flex gap-1"}>
                  <Button
                    size="sm"
                    icon={<ArrowUp className="size-3.5" />}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  />
                  <Button
                    size="sm"
                    icon={<ArrowDown className="size-3.5" />}
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  />
                  <Button size="sm" danger icon={<Trash2 className="size-3.5" />} onClick={() => remove(index)} />
                </div>
              </div>
            ))}

            <Button type="dashed" block icon={<Plus className="size-4" />} onClick={() => add({ name: "", email: "" })}>
              Add contact
            </Button>
            <Form.ErrorList errors={errors} />
          </div>
        )}
      </Form.List>

      <Form.Item className="mt-4">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
