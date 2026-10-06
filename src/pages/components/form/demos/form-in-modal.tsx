import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  return (
    <Form.Provider
      onFormFinish={(name, { values, forms }) => {
        if (name !== "userForm") return;
        setUser({ name: String(values.name ?? ""), email: String(values.email ?? "") });
        forms.userForm.resetFields();
        setOpen(false);
      }}
    >
      <div className="space-y-3">
        <Button type="primary" onClick={() => setOpen(true)}>
          Add user
        </Button>

        <div className="rounded-md border border-border p-3 text-sm text-text-secondary">
          {user ? (
            <>
              Added <span className="font-medium text-text">{user.name}</span> ({user.email})
            </>
          ) : (
            "No user yet"
          )}
        </div>

        <Modal open={open} title="Add user" width={420} footer={null} onCancel={() => setOpen(false)}>
          <Form name="userForm" layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
              <Input placeholder="Full name" />
            </Form.Item>

            <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="name@example.com" />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Form.Provider>
  );
}
