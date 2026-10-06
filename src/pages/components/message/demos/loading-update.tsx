import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const save = () => {
    // reusing the key swaps the toast in place and restarts the timer
    message.loading({ content: "Saving…", key: "save" });
    setTimeout(() => {
      message.success({ content: "Saved successfully", key: "save", duration: 2 });
    }, 1500);
  };

  return (
    <Button type="primary" onClick={save}>
      Save (async)
    </Button>
  );
}
