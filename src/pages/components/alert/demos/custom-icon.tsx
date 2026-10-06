import { Smile } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export default function Demo() {
  const icon = <Smile />;
  return (
    <div className="flex flex-col gap-4">
      <Alert icon={icon} message="showIcon = false" type="success" />
      <Alert icon={icon} message="Success Tips" type="success" showIcon />
      <Alert icon={icon} message="Informational Notes" type="info" showIcon />
      <Alert icon={icon} message="Warning" type="warning" showIcon />
      <Alert icon={icon} message="Error" type="error" showIcon />
      <Alert icon={icon} message="Success Tips" description="Detailed description and advices about successful copywriting." type="success" showIcon />
      <Alert icon={icon} message="Error" description="This is an error message about copywriting." type="error" showIcon />
    </div>
  );
}
