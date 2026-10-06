import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => Modal.info({ title: "Information", content: "These four only show an OK button." })}>
        Info
      </Button>
      <Button onClick={() => Modal.success({ title: "Success", content: "Your invoice was sent." })}>Success</Button>
      <Button onClick={() => Modal.error({ title: "Error", content: "The upload could not be finished." })}>
        Error
      </Button>
      <Button onClick={() => Modal.warning({ title: "Warning", content: "Your session expires in 5 minutes." })}>
        Warning
      </Button>
      <Button
        onClick={() =>
          Modal.info({
            title: "With a Cancel button",
            content: "okCancel: true brings Cancel back to an info dialog.",
            okCancel: true,
          })
        }
      >
        Info + Cancel
      </Button>
    </div>
  );
}
