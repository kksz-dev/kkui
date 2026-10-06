import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [api, contextHolder] = notification.useNotification({ placement: "bottomRight", maxCount: 3 });

  return (
    <>
      {contextHolder}
      <div className="flex flex-wrap gap-2">
        <Button
          type="primary"
          onClick={() =>
            api.success({
              message: "From useNotification()",
              description: "Rendered inside the React tree, bottom right, max 3.",
              onClick: () => api.destroy(),
            })
          }
        >
          Show notification
        </Button>
        <Button onClick={() => api.destroy()}>Destroy all</Button>
      </div>
    </>
  );
}
