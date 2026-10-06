import { Alert } from "@/components/ui/alert";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Alert message="Success Text" description="Success Description Success Description Success Description" type="success" />
      <Alert message="Info Text" description="Info Description Info Description Info Description Info Description" type="info" />
      <Alert message="Warning Text" description="Warning Description Warning Description Warning Description Warning Description" type="warning" />
      <Alert message="Error Text" description="Error Description Error Description Error Description Error Description" type="error" />
    </div>
  );
}
