import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Select } from "@/components/ui/select";

const PRICE: Record<string, number> = { free: 0, pro: 20, team: 45 };

export default function Demo() {
  const [form] = Form.useForm();

  const account = Form.useWatch<string>("account", form);
  const plan = Form.useWatch<string>("plan", form);
  const total = Form.useWatch((values) => Number(values.seats ?? 0) * (PRICE[String(values.plan)] ?? 0), form);

  return (
    <div className="space-y-4">
      <Form form={form} layout="vertical" className="max-w-md" initialValues={{ plan: "pro", seats: 3 }}>
        <Form.Item name="account" label="Account">
          <Input placeholder="Account name" />
        </Form.Item>

        <Form.Item name="plan" label="Plan">
          <Select
            options={[
              { value: "free", label: "Free" },
              { value: "pro", label: "Pro" },
              { value: "team", label: "Team" },
            ]}
          />
        </Form.Item>

        <Form.Item name="seats" label="Seats">
          <InputNumber min={1} max={50} className="w-full" />
        </Form.Item>
      </Form>

      <div className="rounded-md border border-border bg-fill-quaternary p-3 text-sm">
        <div className="text-text-secondary">
          Account: <span className="text-text">{account || "—"}</span>
        </div>
        <div className="text-text-secondary">
          Plan: <span className="text-text">{plan}</span>
        </div>
        <div className="text-text-secondary">
          Monthly total: <span className="font-medium text-primary">${total}</span>
        </div>
      </div>
    </div>
  );
}
