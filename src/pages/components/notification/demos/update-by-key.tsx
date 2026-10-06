import { notification } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const run = () => {
    const key = "upload";
    notification.info({ key, message: "Uploading…", description: "0 of 3 files", duration: 0 });
    let done = 0;
    const timer = setInterval(() => {
      done += 1;
      if (done < 3) {
        notification.info({ key, message: "Uploading…", description: `${done} of 3 files`, duration: 0 });
      } else {
        clearInterval(timer);
        notification.success({ key, message: "Upload finished", description: "3 of 3 files", duration: 3 });
      }
    }, 900);
  };

  return <Button onClick={run}>Update by key</Button>;
}
