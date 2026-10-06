import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [modal, contextHolder] = Modal.useModal();

  const confirm = async () => {
    const instance = modal.confirm({
      title: "Reading the theme from context",
      content: "This dialog lives in the React tree, not in a detached root.",
      okText: "Keep open 1s",
      onOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
    });
    setTimeout(() => instance.update({ content: "…and update() rewrote this content." }), 400);
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-wrap gap-2">
        <Button type="primary" onClick={confirm}>
          modal.confirm()
        </Button>
        <Button onClick={() => modal.success({ title: "Done", content: "Hook instance, OK only." })}>
          modal.success()
        </Button>
      </div>
    </>
  );
}
