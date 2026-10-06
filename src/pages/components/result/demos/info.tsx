import { Result } from "@/components/ui/result";
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <Result
      title="Your operation has been executed"
      extra={
        <Button type="primary" key="console">
          Go Console
        </Button>
      }
    />
  );
}
