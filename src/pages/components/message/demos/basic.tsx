import { message } from "@/components/ui/message";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => message.info("This is a normal message")}>Info</Button>
      <Button onClick={() => message.success("Operation completed successfully")}>Success</Button>
      <Button onClick={() => message.error("This is an error message")}>Error</Button>
      <Button onClick={() => message.warning("Please check your input")}>Warning</Button>
      <Button onClick={() => message.loading("Action in progress", 2)}>Loading</Button>
    </div>
  );
}
