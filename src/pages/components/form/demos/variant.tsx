import { useState } from "react";
import { Form, type FormVariant } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { InputNumber } from "@/components/ui/input-number";
import { DatePicker } from "@/components/ui/date-picker";
import { Radio } from "@/components/ui/radio";

export default function Demo() {
  const [variant, setVariant] = useState<FormVariant>("outlined");

  return (
    <div className="space-y-4">
      <Radio.Group
        value={variant}
        onChange={(e) => setVariant(e.target.value as FormVariant)}
        optionType="button"
        options={[
          { label: "Outlined", value: "outlined" },
          { label: "Filled", value: "filled" },
          { label: "Borderless", value: "borderless" },
          { label: "Underlined", value: "underlined" },
        ]}
      />

      <Form variant={variant} layout="vertical" className="max-w-md">
        <Form.Item name="account" label="Account">
          <Input placeholder="Account" />
        </Form.Item>

        <Form.Item name="secret" label="Password">
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="plan" label="Plan">
          <Select
            placeholder="Pick a plan"
            options={[
              { value: "free", label: "Free" },
              { value: "pro", label: "Pro" },
            ]}
          />
        </Form.Item>

        <Form.Item name="seats" label="Seats">
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item name="starts" label="Starts">
          <DatePicker className="w-full" />
        </Form.Item>
      </Form>
    </div>
  );
}
