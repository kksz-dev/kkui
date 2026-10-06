import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  // the hook renders inside your React tree, so theme and context are shared
  const [api, contextHolder] = message.useMessage({ maxCount: 3 });

  return (
    <>
      {contextHolder}
      <div className="flex flex-wrap gap-2">
        <Button type="primary" onClick={() => api.success("Sent from useMessage()")}>
          Show message
        </Button>
        <Button onClick={() => api.destroy()}>Destroy all</Button>
      </div>
    </>
  );
}
