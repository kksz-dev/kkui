import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          notification.open({
            message: "Notification Title",
            description: "This is the content of the notification. It stays for 4.5 seconds.",
          })
        }
      >
        Open
      </Button>
      <Button type="primary" onClick={() => notification.success({ message: "Saved", description: "Your changes are live." })}>
        Success
      </Button>
      <Button onClick={() => notification.info({ message: "Heads up", description: "A new version is available." })}>
        Info
      </Button>
      <Button onClick={() => notification.warning({ message: "Low disk space", description: "Only 2 GB left on /var." })}>
        Warning
      </Button>
      <Button danger onClick={() => notification.error({ message: "Request failed", description: "The backend did not answer." })}>
        Error
      </Button>
    </div>
  );
}
