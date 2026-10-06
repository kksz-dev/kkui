import { Popconfirm } from "@/components/ui/popconfirm";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function PlacementDemo() {
  const confirm = () => {
    message.info("Clicked Confirm");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Popconfirm placement="topLeft" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>TL</Button>
        </Popconfirm>
        <Popconfirm placement="top" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>Top</Button>
        </Popconfirm>
        <Popconfirm placement="topRight" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>TR</Button>
        </Popconfirm>
      </div>
      <div className="flex gap-2">
        <Popconfirm placement="left" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>Left</Button>
        </Popconfirm>
        <Popconfirm placement="right" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>Right</Button>
        </Popconfirm>
      </div>
      <div className="flex gap-2">
        <Popconfirm placement="bottomLeft" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>BL</Button>
        </Popconfirm>
        <Popconfirm placement="bottom" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>Bottom</Button>
        </Popconfirm>
        <Popconfirm placement="bottomRight" title="Prompt" description="Are you sure to delete this task?" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button>BR</Button>
        </Popconfirm>
      </div>
    </div>
  );
}
