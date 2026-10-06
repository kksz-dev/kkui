import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

export default function Demo() {
  const showConfirm = () => {
    Modal.confirm({
      title: "Delete these 3 items?",
      content: "The OK button waits for the promise before the dialog closes.",
      okText: "Delete",
      okButtonProps: { danger: true },
      autoFocusButton: "cancel",
      onOk: () => new Promise((resolve) => setTimeout(resolve, 1200)),
      onCancel: () => message.info("Cancelled"),
      afterClose: () => message.success("Dialog unmounted"),
    });
  };

  return (
    <Button danger onClick={showConfirm}>
      Confirm delete
    </Button>
  );
}
