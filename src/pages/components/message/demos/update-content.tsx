import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const countdown = () => {
    let left = 3;
    message.open({ content: `Closing in ${left} seconds`, key: "countdown", duration: 0 });
    const timer = setInterval(() => {
      left -= 1;
      if (left > 0) {
        message.open({ content: `Closing in ${left} seconds`, key: "countdown", duration: 0 });
      } else {
        clearInterval(timer);
        message.success({ content: "Done", key: "countdown", duration: 1.5 });
      }
    }, 1000);
  };

  return <Button onClick={countdown}>Update content</Button>;
}
