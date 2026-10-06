import { Result } from "@/components/ui/result";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Result
      status="warning"
      title="There are some problems with your operation."
      extra={
        <Button type="primary" key="console">
          Go Console
        </Button>
      }
    />
  );
}
