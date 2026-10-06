import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Flame } from "lucide-react";

export default function Demo() {
  return (
    <Form layout="vertical" className="max-w-md">
      <Form.Item label="Success" validateStatus="success" hasFeedback help="The name is available.">
        <Input defaultValue="kkui" />
      </Form.Item>

      <Form.Item label="Warning" validateStatus="warning" hasFeedback help="This name is very common.">
        <Input defaultValue="admin" />
      </Form.Item>

      <Form.Item label="Error" validateStatus="error" hasFeedback help="The name is already taken.">
        <Input defaultValue="root" />
      </Form.Item>

      <Form.Item label="Validating" validateStatus="validating" hasFeedback help="Checking availability…">
        <Input defaultValue="checking" />
      </Form.Item>

      <Form.Item label="Select" validateStatus="error" hasFeedback help="Please choose a region.">
        <Select
          placeholder="Choose a region"
          options={[
            { value: "th", label: "Thailand" },
            { value: "sg", label: "Singapore" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Custom feedback icon"
        validateStatus="warning"
        hasFeedback={{ icons: () => ({ warning: <Flame className="size-4 text-warning" /> }) }}
        help="Feedback icons can be replaced per item or per form."
      >
        <Input defaultValue="spicy" />
      </Form.Item>
    </Form>
  );
}
