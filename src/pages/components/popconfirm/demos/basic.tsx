import { Popconfirm } from "@/components/ui/popconfirm";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  return (
    <Popconfirm
      title="Delete the task"
      description="Are you sure to delete this task?"
      onConfirm={() => {
        message.success("Click on Yes");
      }}
      onCancel={() => {
        message.error("Click on No");
      }}
      okText="Yes"
      cancelText="No"
    >
      <Button danger>Delete</Button>
    </Popconfirm>
  );
}
