import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Alert
        message="Success Tips"
        type="success"
        showIcon
        action={
          <Button size="sm" type="text">
            UNDO
          </Button>
        }
        closable
      />
      <Alert
        message="Error Text"
        showIcon
        description="Error Description Error Description Error Description Error Description"
        type="error"
        action={
          <Button size="sm" danger>
            Detail
          </Button>
        }
      />
      <Alert
        message="Warning Text"
        type="warning"
        action={
          <div className="flex flex-col gap-1">
            <Button size="sm" type="text">
              Done
            </Button>
          </div>
        }
        closable
      />
      <Alert
        message="Info Text"
        description="Info Description Info Description Info Description Info Description"
        type="info"
        action={
          <div className="flex flex-col gap-1">
            <Button size="sm" type="primary">
              Accept
            </Button>
            <Button size="sm" danger ghost>
              Decline
            </Button>
          </div>
        }
        closable
      />
    </div>
  );
}
