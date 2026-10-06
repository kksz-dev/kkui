import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const openMany = () => {
    for (let i = 1; i <= 3; i += 1) {
      Modal.info({
        title: `Dialog ${i}`,
        content: "Modal.destroyAll() closes every dialog opened by the static API.",
        zIndex: 1000 + i * 10,
        okText: "OK",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={openMany}>Open 3 dialogs</Button>
      <Button danger onClick={() => Modal.destroyAll()}>
        Destroy all
      </Button>
    </div>
  );
}
