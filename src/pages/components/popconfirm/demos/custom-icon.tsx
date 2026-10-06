import { Popconfirm } from "@/components/ui/popconfirm";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { message } from "@/components/ui/message";

export default function CustomIconDemo() {
  return (
    <Popconfirm
      title="Dangerous operation"
      description="This action is irreversible. Are you sure you want to proceed?"
      icon={<AlertCircle className="size-4 shrink-0 text-error mt-0.5" />}
      okButtonProps={{ danger: true }}
      okText="Yes, delete"
      onConfirm={() => {
        message.warning("Confirmed dangerous action");
      }}
    >
      <Button danger>Custom Warning Icon</Button>
    </Popconfirm>
  );
}
