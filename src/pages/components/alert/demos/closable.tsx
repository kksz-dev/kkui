import { Alert } from "@/components/ui/alert";

export default function Demo() {
  const onClose = () => {
    console.log("I was closed.");
  };
  return (
    <div className="flex flex-col gap-4">
      <Alert message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text" type="warning" closable onClose={onClose} />
      <Alert
        message="Error Text"
        description="Error Description Error Description Error Description Error Description Error Description Error Description"
        type="error"
        closable
        onClose={onClose}
      />
    </div>
  );
}
