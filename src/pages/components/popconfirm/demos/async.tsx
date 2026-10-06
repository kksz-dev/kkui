import { Popconfirm } from "@/components/ui/popconfirm";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function AsyncDemo() {
  const confirm = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
        message.success("Asynchronous action completed successfully");
      }, 2000);
    });
  };

  return (
    <Popconfirm
      title="Async confirm"
      description="Clicking OK will trigger a 2-second async request with loading indicator."
      onConfirm={confirm}
    >
      <Button type="primary">Open Promise Popconfirm</Button>
    </Popconfirm>
  );
}
