import { Alert } from "@/components/ui/alert";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Alert message="Success Text" type="success" />
      <Alert message="Info Text" type="info" />
      <Alert message="Warning Text" type="warning" />
      <Alert message="Error Text" type="error" />
    </div>
  );
}
