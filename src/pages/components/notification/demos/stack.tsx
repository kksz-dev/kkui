import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [api, contextHolder] = notification.useNotification({ stack: { threshold: 3 } });

  return (
    <>
      {contextHolder}
      <div className="flex flex-wrap gap-2">
        <Button
          type="primary"
          onClick={() =>
            api.open({
              message: `Notice ${Math.floor(Math.random() * 900 + 100)}`,
              description: "Open more than three, then hover the pile to expand it.",
              duration: 0,
            })
          }
        >
          Open a notice
        </Button>
        <Button onClick={() => api.destroy()}>Clear</Button>
      </div>
    </>
  );
}
