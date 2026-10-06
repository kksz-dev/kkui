import { Form } from "@/components/ui/form";
import { InputNumber } from "@/components/ui/input-number";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

interface PriceValue {
  amount?: number;
  currency?: string;
}

/** Any component with `value` + `onChange` can be driven by Form.Item. */
function PriceInput({ value = {}, onChange }: { value?: PriceValue; onChange?: (value: PriceValue) => void }) {
  const emit = (patch: PriceValue) => onChange?.({ ...value, ...patch });

  return (
    <div className="flex gap-2">
      <InputNumber
        className="w-32"
        min={0}
        value={value.amount ?? null}
        onChange={(amount) => emit({ amount: amount ?? undefined })}
      />
      <Select
        className="w-28"
        value={value.currency ?? "thb"}
        onChange={(currency) => emit({ currency: String(currency) })}
        options={[
          { value: "thb", label: "THB" },
          { value: "usd", label: "USD" },
        ]}
      />
    </div>
  );
}

export default function Demo() {
  return (
    <Form
      layout="vertical"
      className="max-w-md"
      initialValues={{ price: { amount: 100, currency: "thb" } }}
      onFinish={(values) => message.success(`Submit: ${JSON.stringify(values)}`)}
    >
      <Form.Item
        name="price"
        label="Price"
        rules={[
          {
            validator: (_rule, value) => {
              const price = value as PriceValue | undefined;
              if (price?.amount && price.amount > 0) return Promise.resolve();
              return Promise.reject(new Error("Price must be greater than zero"));
            },
          },
        ]}
      >
        <PriceInput />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
