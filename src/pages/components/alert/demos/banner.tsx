import { Alert } from "@/components/ui/alert";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Alert message="Warning text" banner />
      <Alert message="Very long warning text warning text text text text text text text" banner closable />
      <Alert showIcon={false} message="Warning text without icon" banner />
      <Alert type="error" message="Error text" banner />
    </div>
  );
}
